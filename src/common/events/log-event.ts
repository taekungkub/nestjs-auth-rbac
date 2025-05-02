export class LogEvent {
  user_id: string;
  action: string;
  description?: string;
  url?: string;
  ipAddress?: string;
  userAgent?: string;
  data?: any;

  constructor(partial: Partial<LogEvent>) {
    Object.assign(this, partial);
  }
}
