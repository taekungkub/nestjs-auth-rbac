// notification.controller.ts
import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('admin')
  streamToAdmin(): Observable<MessageEvent> {
    return this.notificationService.getStream().pipe(map((data) => ({ data })));
  }
}

// 2. Notify admin via SSE (call in anoth service)
// this.notificationService.send(`📩 New user registered: ${newUser.email}`);
