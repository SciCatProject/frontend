import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class SnackbarInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((e) => {
        if (
          request.method == "POST" ||
          request.method == "PUT" ||
          request.method == "PATCH" ||
          request.method == "DELETE"
        ) {
          if (e instanceof HttpResponse && (e.status == 200 || e.status == 201)) {
            this.snackBar.open("Success", "close", {
              duration: 3000,
              panelClass: "snackbar-success",
            });
          }
        }
      }),
      catchError((error) => {
        this.snackBar.open("Error occurred", "close", {
          duration: 3000,
          panelClass: "snackbar-error",
        });
        return throwError(error);
      })
    );
  }
}
