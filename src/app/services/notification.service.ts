import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface NotificationData {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData | null>(null);
  notification$ = this.notificationSubject.asObservable();
  private timeout: any;

  show(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.notificationSubject.next({ message, type });

    this.timeout = setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.notificationSubject.next(null);
  }
}
