import { Injectable } from "@angular/core";
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
} from "state-management/actions/admin.action";
import { RuntimeConfigService } from "@scicatproject/scicat-sdk-ts-angular";

// Types
export interface AdminConfiguration {
  [key: string]: any;
}

@Injectable()
export class AdminEffects {
  loadConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadConfiguration),
      switchMap(() => {
        const configName = "frontendConfig";
        return this.runtimeConfigService
          .runtimeConfigControllerGetConfigV3(configName)
          .pipe(
            map((config: AdminConfiguration) => {
              return loadConfigurationSuccess({ config });
            }),
            catchError((error) => of(loadConfigurationFailure({ error }))),
          );
      }),
    ),
  );

  updateConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateConfiguration),
      exhaustMap(({ config }) => {
        const configName = "frontendConfig";
        return this.runtimeConfigService
          .runtimeConfigControllerUpdateConfigV3(configName, config)
          .pipe(
            map((config: AdminConfiguration) =>
              updateConfigurationSuccess({ config }),
            ),
            catchError((error) => of(updateConfigurationFailure({ error }))),
          );
      }),
    ),
  );
  constructor(
    private actions$: Actions,
    private runtimeConfigService: RuntimeConfigService,
  ) {}
}
