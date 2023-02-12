export interface BaseStrategy {
  urlRegex: RegExp;

  build(url: string, timeout: number): Promise<Buffer[]>;
}
