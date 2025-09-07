import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milisegundos
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  constructor() { }

  show(message: string, type: NotificationMessage['type'] = 'info', duration: number = 5000) {
    const notification: NotificationMessage = {
      message,
      type,
      duration
    };

    this.notificationSubject.next(notification);

    // Auto-hide después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  hide() {
    this.notificationSubject.next(null);
  }
}
