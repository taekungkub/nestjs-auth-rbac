import { IRole } from '../types/role.type';

export class LogEvent {
  constructor(
    public readonly user_id: string,
    public readonly username: string,
    public readonly role: IRole[],
    public readonly action: string,
    public readonly description?: string,
    public readonly url?: string,
    public readonly ip_address?: string,
    public readonly user_agent?: string,
    public readonly data?: Record<string, any>,
  ) {}
}
