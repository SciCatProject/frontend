import { Observable } from "rxjs";
import { InstrumentEffects } from "./instruments.effects";
import { InstrumentApi, Instrument } from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/instruments.actions";
import { hot, cold } from "jasmine-marbles";

describe("InstrumentEffects", () => {
  let actions: Observable<any>;
  let effects: InstrumentEffects;
  let instrumentApi: jasmine.SpyObj<InstrumentApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InstrumentEffects,
        provideMockActions(() => actions),
        {
          provide: InstrumentApi,
          useValue: jasmine.createSpyObj("instrumentApi", ["find"])
        }
      ]
    });

    effects = TestBed.get(InstrumentEffects);
    instrumentApi = TestBed.get(InstrumentApi);
  });

  describe("fetchInstruments$", () => {
    it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
      const instruments = [new Instrument()];
      const action = fromActions.fetchInstrumentsAction();
      const outcome1 = fromActions.fetchInstrumentsCompleteAction({
        instruments
      });
      const outcome2 = fromActions.fetchCountAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instruments });
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchInstruments$).toBeObservable(expected);
    });

    it("should result in a fetchInstrumentsFailedAction", () => {
      const action = fromActions.fetchInstrumentsAction();
      const outcome = fromActions.fetchInstrumentsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchInstruments$).toBeObservable(expected);
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const instruments = [new Instrument()];
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountCompleteAction({
        count: instruments.length
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instruments });
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });
});
