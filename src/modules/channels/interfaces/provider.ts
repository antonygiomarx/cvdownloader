export interface Provider {
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
