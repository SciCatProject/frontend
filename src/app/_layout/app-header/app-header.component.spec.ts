import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { AppHeaderComponent } from "./app-header.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatMenuModule,  } from "@angular/material/menu";
import { MatToolbarModule,  } from "@angular/material/toolbar";

import { Store, StoreModule } from "@ngrx/store";
import { APP_CONFIG } from "app-config.module";
import { logoutAction } from "state-management/actions/user.actions";
import { MockStore } from "shared/MockStubs";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppHeaderComponent],
      imports: [MatMenuModule, MatToolbarModule, StoreModule.forRoot({})]
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
