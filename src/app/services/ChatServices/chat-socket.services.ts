
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { ChatMessageModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  private socket$: WebSocketSubject<any>;
  private readonly WS_URL = 'wss://localhost:7060/chat'; 

  constructor() {
    this.socket$ = webSocket(this.WS_URL);
  }

  sendMessage(message: ChatMessageModel): void {
    this.socket$.next(message);
  }

  getMessages(): Observable<ChatMessageModel> {
    return this.socket$.asObservable();
  }

  close(): void {
    this.socket$.complete();
  }
}
