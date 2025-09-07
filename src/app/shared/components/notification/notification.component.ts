import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, NotificationMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: NotificationMessage | null = null;
  private subscription: Subscription = new Subscription();
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => {
        this.notification = notification;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.notificationService.hide();
  }

  getNotificationClasses(): string {
    if (!this.notification) return '';
    
    const baseClasses = 'fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm w-full z-50 transition-all duration-300 transform';
    
    switch (this.notification.type) {
      case 'success':
        return `${baseClasses} bg-green-100 border border-green-400 text-green-700`;
      case 'error':
        return `${baseClasses} bg-red-100 border border-red-400 text-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 border border-yellow-400 text-yellow-700`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-100 border border-blue-400 text-blue-700`;
    }
  }

  getIconClasses(): string {
    if (!this.notification) return '';
    
    switch (this.notification.type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  }
}
