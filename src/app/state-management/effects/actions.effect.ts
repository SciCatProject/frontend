import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import * as fromActions from "state-management/actions/actions.actions";
import { map } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

@Injectable()
export class ActionEffects {
  handleActionMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.actionSuccessAction, fromActions.actionFailureAction),
      map((action) => {
        if (action.type === fromActions.actionSuccessAction.type) {
          return showMessageAction({
            message: new Message(
              action.message || "Success!",
              MessageType.Success,
              5000,
            ),
          });
        } else {
          return showMessageAction({
            message: new Message(
              action.message || "An error occurred.",
              MessageType.Error,
              5000,
            ),
          });
        }
      }),
    );
  });
  constructor(private actions$: Actions) {}
}
