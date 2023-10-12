import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfigService } from "app-config.service";

@Injectable()
export class SnackbarInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    public config: AppConfigService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((e) => {
        if (
          this.config.getConfig().notificationInterceptorEnabled &&
          (request.method == "POST" ||
            request.method == "PUT" ||
            request.method == "PATCH" ||
            request.method == "DELETE")
        ) {
          if (
            e instanceof HttpResponse &&
            (e.status == 200 || e.status == 201)
          ) {
            this.snackBar.open("Success", "close", {
              duration: 3000,
              panelClass: "snackbar-success",
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (this.config.getConfig().notificationInterceptorEnabled) {
          this.snackBar.open(
            `Error occurred: ${error.status} ${error.statusText}`,
            "close",
            {
              duration: 3000,
              panelClass: "snackbar-error",
            },
          );
        }
        return throwError(error);
      }),
    );
  }
}
