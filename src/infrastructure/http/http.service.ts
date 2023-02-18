import { Injectable } from '@nestjs/common';
import { HttpService as HttpServiceProvider } from '@nestjs/axios';

import { HttpConfig } from '@domain/http/http.interface';

@Injectable()
export class HttpService implements HttpConfig {
  constructor(private readonly httpServiceProvider: HttpServiceProvider) {}

  async get<T>(url: string, config?: Record<string, unknown>): Promise<T> {
    const { data } = await this.httpServiceProvider
      .get<T>(url, config)
      .toPromise();

    return data;
  }

  async post<T>(url: string, config?: Record<string, unknown>): Promise<T> {
    const { data } = await this.httpServiceProvider
      .post<T>(url, config)
      .toPromise();

    return data as T;
  }
}
