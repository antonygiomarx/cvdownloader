export interface HttpConfig {
  get<T>(url: string, config?: Record<string, unknown>): Promise<T>;

  post<T>(url: string, config?: Record<string, unknown>): Promise<T>;
}
