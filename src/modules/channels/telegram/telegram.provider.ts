import { Provider } from '@/modules/channels/interfaces/provider';

export class TelegramProvider implements Provider {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  url?: string;
  token?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
