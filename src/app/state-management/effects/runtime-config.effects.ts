import { Inject, Injectable, Optional } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, map, catchError, exhaustMap } from "rxjs/operators";
import {
  loadConfiguration,
  loadConfigurationFailure,
  loadConfigurationSuccess,
  updateConfiguration,
  updateConfigurationFailure,
  updateConfigurationSuccess,
} from "state-management/actions/runtime-config.action";
import { RuntimeConfigService } from "@scicatproject/scicat-sdk-ts-angular";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "app-config.service";

// Types
export interface Configuration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

@Injectable()
export class RunTimeConfigEffects {
  loadConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadConfiguration),
      switchMap(({ id }) =>
        this.runtimeConfigService.runtimeConfigControllerGetConfigV3(id).pipe(
          map((config: Configuration) => loadConfigurationSuccess({ config })),
          catchError((error) => of(loadConfigurationFailure({ error }))),
        ),
      ),
    );
  });

  updateConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateConfiguration),
      exhaustMap(({ id, config }) => {
        return this.runtimeConfigService
          .runtimeConfigControllerUpdateConfigV3(id, config)
          .pipe(
            map((config: Configuration) =>
              updateConfigurationSuccess({ config }),
            ),
            catchError((error) => of(updateConfigurationFailure({ error }))),
          );
      }),
    );
  });
  constructor(
    private actions$: Actions,
    @Optional() private runtimeConfigService: RuntimeConfigService,
    private http: HttpClient,
    private appConfigService: AppConfigService,
  ) {
    // Fallback: create RuntimeConfigService manually if not injected
    if (!this.runtimeConfigService) {
      const basePath = this.appConfigService.getConfig().lbBaseURL;
      this.runtimeConfigService = new RuntimeConfigService(this.http, basePath);
    }
  }
}
