import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { AppHeaderComponent } from "./app-header.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatMenuModule, MatToolbarModule } from "@angular/material";
import { MockStore } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { APP_CONFIG } from "app-config.module";
import { rootReducer } from "state-management/reducers/root.reducer";
import { logoutAction } from "state-management/actions/user.actions";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppHeaderComponent],
      imports: [
        MatMenuModule,
        MatToolbarModule,
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.overrideComponent(AppHeaderComponent, {
      set: {
        providers: [{ provide: APP_CONFIG, useValue: { facility: "ESS" } }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#logout()", () => {
    it("should dispatch a LogoutAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.logout();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(logoutAction());
    });
  });
});
