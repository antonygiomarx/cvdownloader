interface Core {
  core: unknown;
}

export interface ScrapperProvider extends Core {
  scrape(url: string, timeout: number): Promise<Buffer[]>;
}
