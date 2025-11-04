// chat-overlay.service.ts (înlocuiește / extinde ce ai)
import { Injectable, Injector, ApplicationRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';
import { ChatWindowComponent } from '../../component/chat-window/chat-window.component';

export interface ChatMessage {
  from: string;
  text: string;
  time: string;
}

interface ChatSession {
  user: string;
  messages: ChatMessage[];
  minimized: boolean;
  position?: { left:number; top:number; width:number; height:number };
}

@Injectable({ providedIn: 'root' })
export class ChatOverlayService {
  private overlayRef: OverlayRef | null = null;
  private sessions: Map<string, ChatSession> = new Map();

  // keys for storage
  private messagesKeyPrefix = 'chatOverlay.messages.';
  private positionStateKeyPrefix = 'chatOverlay.position.';

  // observables UI
  openUsers$ = new BehaviorSubject<string[]>([]);
  activeUser$ = new BehaviorSubject<string | null>(null);
  minimizedUsers$ = new BehaviorSubject<string[]>([]);
  visible$ = new BehaviorSubject<boolean>(false);

  constructor(private overlay: Overlay, private injector: Injector, private appRef: ApplicationRef) {
    // load any previously known sessions user-lists if needed (optional)
    const known = localStorage.getItem('chatOverlay.knownUsers');
    if (known) {
      try {
        const arr: string[] = JSON.parse(known);
        arr.forEach(u => {
          const msgs = this.loadMessagesFor(u) || [];
          this.sessions.set(u, { user: u, messages: msgs, minimized: false });
        });
        this.emitLists();
      } catch {}
    }
  }

  // === sessions management ===
  open(user: string) {
    if (!this.sessions.has(user)) {
      const msgs = this.loadMessagesFor(user) || [];
      this.sessions.set(user, { user, messages: msgs, minimized: false, position: this.loadPositionFor(user) || undefined });
      this.saveKnownUsers();
    } else {
      // if was minimized, restore it
      const s = this.sessions.get(user)!;
      s.minimized = false;
    }

    this.createOverlayIfNeeded();
    this.visible$.next(true);
    this.activeUser$.next(user);
    this.emitLists();
  }

  close(user: string) {
    this.sessions.delete(user);
    this.saveKnownUsers();
    // if no sessions left, hide overlay
    if (this.sessions.size === 0) {
      this.visible$.next(false);
      this.detachOverlay();
      this.activeUser$.next(null);
    } else {
      // if closed active, pick another
      const next = Array.from(this.sessions.keys())[0];
      this.activeUser$.next(next);
    }
    this.emitLists();
  }

  minimize(user: string) {
  const s = this.sessions.get(user);
  if (!s) return;

  // salvează poziția curentă (dacă ai)
  if (s.position) {
    this.savePosition(user, s.position);
  }

  s.minimized = true;

  // emit listă minimizate
  this.minimizedUsers$.next(this.getMinimizedUsers());

  // dacă era userul activ, ascunde overlay-ul
  if (this.activeUser$.value === user) {
    this.visible$.next(false);
    // detasează overlay (dacă e atașat)
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      try { this.overlayRef.detach(); } catch (e) { console.warn('detach error', e); }
    }
    // nu face activeUser null imediat — păstrează valoarea (sau setează null dacă preferi)
    // this.activeUser$.next(null);
  }

  // propagatează schimbările lista/openUsers (optional)
  this.emitLists();
}


  restore(user: string) {
  const s = this.sessions.get(user);
  if (!s) return;
  s.minimized = false;
  this.minimizedUsers$.next(this.getMinimizedUsers());

  // re-creează/atașează overlay dacă e nevoie
  this.createOverlayIfNeeded();
  if (this.overlayRef && !this.overlayRef.hasAttached()) {
    const portal = new ComponentPortal(ChatWindowComponent, null, this.injector);
    this.overlayRef.attach(portal);
  }

  this.visible$.next(true);
  this.activeUser$.next(user);
  this.emitLists();
}


  switchTo(user: string) {
    if (!this.sessions.has(user)) return;
    this.activeUser$.next(user);
    this.visible$.next(true);
    this.emitLists();
  }

  // messages per user
  getMessages(user: string): ChatMessage[] {
    return this.sessions.get(user)?.messages ?? [];
  }

  pushLocalMessage(user: string, msg: ChatMessage) {
    let s = this.sessions.get(user);
    if (!s) {
      s = { user, messages: [], minimized: false };
      this.sessions.set(user, s);
      this.saveKnownUsers();
    }
    s.messages.push(msg);
    this.saveMessagesFor(user, s.messages);
    this.emitLists();
  }

  simulateIncomingReply(user: string) {
    setTimeout(() => {
      const reply: ChatMessage = {
        from: user,
        text: 'Răspuns mock: am primit mesajul tău!',
        time: new Date().toLocaleTimeString()
      };
      this.pushLocalMessage(user, reply);
    }, 1000 + Math.random() * 2000);
  }

  // === position persistence per user ===
  savePosition(user: string, pos: { left:number; top:number; width:number; height:number }) {
    localStorage.setItem(this.positionStateKeyPrefix + user, JSON.stringify(pos));
    const s = this.sessions.get(user);
    if (s) s.position = pos;
  }

  loadPositionFor(user: string) {
    const s = localStorage.getItem(this.positionStateKeyPrefix + user);
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
  }

  // === storage helpers ===
  private saveMessagesFor(user: string, msgs: ChatMessage[]) {
    localStorage.setItem(this.messagesKeyPrefix + user, JSON.stringify(msgs));
  }
  private loadMessagesFor(user: string): ChatMessage[] | null {
    const s = localStorage.getItem(this.messagesKeyPrefix + user);
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
  }

  private saveKnownUsers() {
    localStorage.setItem('chatOverlay.knownUsers', JSON.stringify(Array.from(this.sessions.keys())));
  }

  // === overlay handling: single overlay that hosts ChatWindowComponent ===
  private createOverlayIfNeeded() {
    if (!this.overlayRef) {
      const config = new OverlayConfig({
        hasBackdrop: false,
        panelClass: 'chat-overlay-panel',
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      });
      this.overlayRef = this.overlay.create(config);
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      const portal = new ComponentPortal(ChatWindowComponent, null, this.injector);
      const ref = this.overlayRef.attach(portal);
      // you can do more with ref if needed
    }
  }

  private detachOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private emitLists() {
    this.openUsers$.next(Array.from(this.sessions.keys()));
    this.minimizedUsers$.next(this.getMinimizedUsers());
  }

  private getMinimizedUsers(): string[] {
    return Array.from(this.sessions.values()).filter(s => s.minimized).map(s => s.user);
  }
}
