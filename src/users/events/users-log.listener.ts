import { MyClsStore } from '@/common/types/myclsstore.type';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserLogListener {
  constructor(private readonly cls: ClsService<MyClsStore>) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event) {
    const user_agent = this.cls.get('userAgent');
    const ip_address = this.cls.get('ipAddress');

    const log = {
      ...event,
      user_agent,
      ip_address,
    };

    console.log(log);

    // handle store to db
  }
}
