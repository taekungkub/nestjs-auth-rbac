import { MyClsStore } from '@/common/types/myclsstore.type';
import { MyLogService } from '@/my-log/my-log.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthLogListener {
  constructor(
    private readonly cls: ClsService<MyClsStore>,
    private readonly myLogService: MyLogService,
  ) {}

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
    this.myLogService.create(log);
  }
}
