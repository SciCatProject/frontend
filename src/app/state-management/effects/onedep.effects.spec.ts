import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable } from "rxjs";
import { OneDepEffects } from "./onedep.effects";
import { Actions } from "@ngrx/effects";

describe("OneDepEffects", () => {
  let actions$: Observable<any>;
  let effects: OneDepEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OneDepEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(OneDepEffects);
  });

  it("should be created", () => {
    expect(effects).toBeTruthy();
  });
});