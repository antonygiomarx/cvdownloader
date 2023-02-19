export interface BaseStrategyInterface {
  build(url: string, timeout: number): Promise<Buffer[]>;
}
