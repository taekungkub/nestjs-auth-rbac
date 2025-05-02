import { ClsStore } from 'nestjs-cls';

export interface MyClsStore extends ClsStore {
  userAgent: string;
  ipAddress: string;
}
