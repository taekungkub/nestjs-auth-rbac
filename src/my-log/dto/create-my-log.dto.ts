export class CreateMyLogDto {
  user_id: string;
  action: string;
  description?: string;
  url?: string;
  ip_address?: string;
  user_agent?: string;
  data?: Record<string, any>;
}
