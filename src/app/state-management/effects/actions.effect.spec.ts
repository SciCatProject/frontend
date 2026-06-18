import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { ActionEffects } from "./actions.effect";
import { hot, cold } from "jasmine-marbles";
import * as fromActions from "state-management/actions/actions.actions";
import { showMessageAction } from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";
import { TestObservable } from "jasmine-marbles/src/test-observables";

describe("ActionEffects", () => {
  let actions: TestObservable;
  let effects: ActionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionEffects, provideMockActions(() => actions)],
    });

    effects = TestBed.inject(ActionEffects);
  });

  it("should map success action to success snackbar message", () => {
    const action = fromActions.actionSuccessAction("Done");
    const outcome = showMessageAction({
      message: new Message("Done", MessageType.Success, 5000),
    });

    actions = hot("-a", { a: action });
    const expected = cold("-b", { b: outcome });

    expect(effects.handleActionMessages$).toBeObservable(expected);
  });

  it("should use default success message when success message is missing", () => {
    const action = fromActions.actionSuccessAction();
    const outcome = showMessageAction({
      message: new Message("Success!", MessageType.Success, 5000),
    });

    actions = hot("-a", { a: action });
    const expected = cold("-b", { b: outcome });

    expect(effects.handleActionMessages$).toBeObservable(expected);
  });

  it("should map failure action to error snackbar message", () => {
    const action = fromActions.actionFailureAction("Not allowed");
    const outcome = showMessageAction({
      message: new Message("Not allowed", MessageType.Error, 5000),
    });

    actions = hot("-a", { a: action });
    const expected = cold("-b", { b: outcome });

    expect(effects.handleActionMessages$).toBeObservable(expected);
  });

  it("should use default error message when failure message is missing", () => {
    const action = fromActions.actionFailureAction();
    const outcome = showMessageAction({
      message: new Message("An error occurred.", MessageType.Error, 5000),
    });

    actions = hot("-a", { a: action });
    const expected = cold("-b", { b: outcome });

    expect(effects.handleActionMessages$).toBeObservable(expected);
  });
});
