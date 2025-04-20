import { CLS_IP_ADDRESS, CLS_USER_AGENT } from '@/common/cls.constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserLogListener {
  constructor(private readonly cls: ClsService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event) {
    const user_agent = this.cls.get(CLS_USER_AGENT);
    const ip_address = this.cls.get(CLS_IP_ADDRESS);

    const log = {
      ...event,
      user_agent,
      ip_address,
    };

    console.log(log);

    // handle store to db
  }
}
