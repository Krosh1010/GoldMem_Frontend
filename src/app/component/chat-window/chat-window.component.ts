// chat-window.component.ts (modificat)
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatOverlayService, ChatMessage } from '../../services/ChatServices/chat-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  title = 'Chat';
  messages: ChatMessage[] = [];
  input = '';

  left = 0; top = 0; width = 360; height = 420;
  private dragging = false; private dragOffsetX = 0; private dragOffsetY = 0;
  private resizing = false; private resizeStartX = 0; private resizeStartY = 0; private startWidth = 0; private startHeight = 0;

  openUsers: string[] = [];
  minimizedUsers: string[] = [];
  activeUser: string | null = null;

  private subs: Subscription[] = [];

  constructor(private overlayService: ChatOverlayService) {}

  ngOnInit(): void {
    // set default position
    this.width = 360; this.height = 420;
    this.left = window.innerWidth - this.width - 20;
    this.top = window.innerHeight - this.height - 20;

    this.subs.push(this.overlayService.openUsers$.subscribe(list => this.openUsers = list));
    this.subs.push(this.overlayService.minimizedUsers$.subscribe(list => this.minimizedUsers = list));
    this.subs.push(this.overlayService.activeUser$.subscribe(u => {
      this.activeUser = u;
      this.title = u ?? 'Chat';
      if (!u) { this.messages = []; return; }
      // load stored position for this user if any
      const p = this.overlayService['loadPositionFor'] ? this.overlayService['loadPositionFor'](u) : null;
      if (p) { this.left = p.left; this.top = p.top; this.width = p.width; this.height = p.height; }
      this.messages = this.overlayService.getMessages(u);
      setTimeout(() => this.scrollToBottom(), 0);
    }));

    // visibility handling (hide/show)
    this.subs.push(this.overlayService.visible$.subscribe(v => {
      // if hidden, overlay may detach automatically
      // no direct DOM action required here because overlay manages attach/detach
    }));
  }

  ngOnDestroy(): void {
    if (this.activeUser) {
      this.overlayService.savePosition(this.activeUser, { left: this.left, top: this.top, width: this.width, height: this.height });
    }
    this.subs.forEach(s => s.unsubscribe());
  }

  send(): void {
    const text = this.input.trim();
    if (!text || !this.activeUser) return;
    const msg: ChatMessage = { from: 'Tu', text, time: new Date().toLocaleTimeString() };
    this.overlayService.pushLocalMessage(this.activeUser, msg);
    this.input = '';
    this.overlayService.simulateIncomingReply(this.activeUser);
  }

  closeCurrent() {
    if (!this.activeUser) return;
    this.overlayService.close(this.activeUser);
  }

  minimizeCurrent() {
  if (!this.activeUser) return;
  // salvează poziția casetă (înainte de detach)
  this.overlayService.savePosition(this.activeUser, { left: this.left, top: this.top, width: this.width, height: this.height });
  this.overlayService.minimize(this.activeUser);
}


  switchTo(user: string) {
    this.overlayService.switchTo(user);
  }

  // dragging / resizing (la fel ca înainte)
  startDrag(e: MouseEvent) { this.dragging = true; this.dragOffsetX = e.clientX - this.left; this.dragOffsetY = e.clientY - this.top; e.preventDefault(); }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.dragging) {
      this.left = e.clientX - this.dragOffsetX;
      this.top = e.clientY - this.dragOffsetY;
      this.left = Math.max(0, Math.min(this.left, window.innerWidth - 120));
      this.top = Math.max(0, Math.min(this.top, window.innerHeight - 80));
    } else if (this.resizing) {
      const dx = e.clientX - this.resizeStartX;
      const dy = e.clientY - this.resizeStartY;
      this.width = Math.max(240, Math.round(this.startWidth + dx));
      this.height = Math.max(200, Math.round(this.startHeight + dy));
    }
  }
  @HostListener('document:mouseup')
  onMouseUp() { if (this.dragging) this.dragging = false; if (this.resizing) this.resizing = false; }

  startResize(e: MouseEvent) { this.resizing = true; this.resizeStartX = e.clientX; this.resizeStartY = e.clientY; this.startWidth = this.width; this.startHeight = this.height; e.preventDefault(); }

  private scrollToBottom() {
    const container = document.querySelector('.chat-body .messages');
    if (container) container.scrollTop = container.scrollHeight;
  }
}
