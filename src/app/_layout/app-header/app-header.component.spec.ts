import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { AppHeaderComponent } from "./app-header.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";

import { Store, StoreModule } from "@ngrx/store";
import { APP_CONFIG } from "app-config.module";
import { logoutAction } from "state-management/actions/user.actions";
import { MockRouter, MockStore } from "shared/MockStubs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { provideMockStore } from "@ngrx/store/testing";
import {
  selectIsLoggedIn,
  selectCurrentUserName,
  selectThumbnailPhoto,
} from "state-management/selectors/user.selectors";
import { AppConfigService } from "app-config.service";
import { Router } from "@angular/router";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  let store: MockStore;
  let dispatchSpy;

  const getConfig = () => ({
    facility: "ESS",
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppHeaderComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectCurrentUserName,
              value: "User Name",
            },
            {
              selector: selectThumbnailPhoto,
              value: "assets/images/user.png",
            },
            { selector: selectIsLoggedIn, value: true },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(AppHeaderComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { production: false } },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: Router, useClass: MockRouter },
        ],
      },
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
