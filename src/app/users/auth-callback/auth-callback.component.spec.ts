import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { MockActivatedRoute, MockRouter, MockStore } from "shared/MockStubs";
import { selectLoginPageViewModel } from "state-management/selectors/user.selectors";
import { AuthCallbackComponent } from "./auth-callback.component";

describe("AuthCallbackComponent", () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AuthCallbackComponent],
      imports: [StoreModule.forRoot({})],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectLoginPageViewModel,
              value: { isLoggedIn: true, isLoggingIn: false },
            },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(AuthCallbackComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("component construction", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AuthCallbackComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      TestBed.compileComponents();
    });
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });
});
