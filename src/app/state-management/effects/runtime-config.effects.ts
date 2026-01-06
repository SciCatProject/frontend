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
} from "state-management/actions/runtime-config.action";
import { RuntimeConfigService } from "@scicatproject/scicat-sdk-ts-angular";

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
    private runtimeConfigService: RuntimeConfigService,
  ) {}
}
