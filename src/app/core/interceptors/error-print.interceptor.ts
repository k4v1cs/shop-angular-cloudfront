import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (err) => {
          const url = new URL(request.url);
          let cause = 'Check the console for the details';
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              cause = 'Authentication failed. Please check your credentials.';
            } else if (err.status === 403) {
              cause =
                'Authorization failed. You do not have the necessary permissions.';
            }
          }

          this.notificationService.showError(
            `Request to "${url.pathname}" failed. ${cause}`,
            0,
          );
        },
      }),
    );
  }
}
