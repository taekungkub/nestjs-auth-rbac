// notification.service.ts
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationService {
  private readonly notificationStream = new Subject<{ message: string }>();

  getStream() {
    return this.notificationStream.asObservable();
  }

  send(message: string) {
    this.notificationStream.next({ message });
  }
}
