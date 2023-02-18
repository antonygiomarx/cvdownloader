export interface TelegramConfig {
  getTelegramToken(): string;

  getTelegramWebhookUrl(): string;
}
