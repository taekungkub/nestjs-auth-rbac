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

  // onModuleInit() {
  //   // Mock: send a new message every 1 second
  //   interval(1000).subscribe((count) => {
  //     this.send(`Mock message #${count + 1}`);
  //   });
  // }
}
