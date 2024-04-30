import { Injectable, Injector } from '@angular/core';
import { ApiEndpoint, Config } from '../../environments/config.interface';
import { CONFIG_TOKEN } from './injection-tokens/config.token';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/** Base class for services working with APIs */
@Injectable()
export abstract class ApiService {
  protected readonly config: Config;
  protected readonly http: HttpClient;

  protected constructor(protected readonly injector: Injector) {
    this.config = injector.get(CONFIG_TOKEN);
    this.http = injector.get(HttpClient);
  }

  get auth(): HttpHeaders {
    const authorization_token = localStorage.getItem('authorization_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(authorization_token
        ? { Authorization: 'Basic ' + btoa(authorization_token) }
        : {}),
    });
    return headers;
  }

  endpointEnabled(api: ApiEndpoint): boolean {
    return this.config.apiEndpointsEnabled[api];
  }

  /** Combines API endpoint and path into a single URL */
  protected getUrl(api: ApiEndpoint, path: string): string {
    return Location.joinWithSlash(this.config.apiEndpoints[api], path);
  }
}
