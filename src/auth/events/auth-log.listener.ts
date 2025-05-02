import { MyClsStore } from '@/common/types/myclsstore.type';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthLogListener {
  constructor(private readonly cls: ClsService<MyClsStore>) {}

  @OnEvent('auth.login')
  async handleLoginEvent(event) {
    const user_agent = this.cls.get('userAgent');
    const ip_address = this.cls.get('ipAddress');

    const log = {
      ...event,
      user_agent,
      ip_address,
    };

    // handle store to db
  }
}
