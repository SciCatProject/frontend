import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { MockActivatedRoute, MockRouter, MockStore } from "shared/MockStubs";
import { LoginComponent } from "./login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  funcLoginAction,
  loginAction,
} from "state-management/actions/user.actions";
import { PrivacyDialogComponent } from "users/privacy-dialog/privacy-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AppConfigService, OAuth2Endpoint } from "app-config.service";
import { provideMockStore } from "@ngrx/store/testing";
import { selectLoginPageViewModel } from "state-management/selectors/user.selectors";
import { HttpErrorResponse } from "@angular/common/http";
import { MatTabsModule } from "@angular/material/tabs";

const getConfig = () => ({
  archiveWorkflowEnabled: true,
  facility: "not-ESS",
  loginFormEnabled: true,
  oAuth2Endpoints: [],
  lbBaseURL: "http://foo",
});

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectLoginPageViewModel,
              value: { isLoggedIn: false, isLoggingIn: false },
            },
          ],
        }),
      ],
    });
    TestBed.overrideComponent(LoginComponent, {
      set: {
        // These should sync up with what is in the constructor, they do NOT need to be provided in the config for the testing module
        providers: [
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
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
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.appConfig.loginFormEnabled = false;
      fixture.detectChanges();
      TestBed.compileComponents();
    });
    it("should have a Document instance injected", () => {
      expect(component.document).toBeTruthy();
    });
  });

  describe("#openPrivacyDialog()", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.appConfig.loginFormEnabled = false;
      component.appConfig.facility = "ESS";
      fixture.detectChanges();
    });
    it("should open the privacy dialog", () => {
      spyOn(component.dialog, "open");

      component.openPrivacyDialog();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        PrivacyDialogComponent,
        { width: "auto" },
      );
    });
  });

  describe("not ESS", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.appConfig.facility = "not-ESS";
      component.appConfig.loginFormEnabled = true;
      fixture.detectChanges();
    });
    it("should should not appear", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("privacy-notice")).toBeFalsy();
    });
  });

  describe("#onLogin()", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should dispatch a loginAction", () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: "Bad Request",
      });

      dispatchSpy = spyOn(store, "dispatch");
      component.onLogin();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        funcLoginAction({
          form: { username: "", password: "", rememberMe: true },
        }),
      );
    });
  });

  describe("#onLdapLogin()", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should dispatch a ldapLoginAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onLdapLogin();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        loginAction({ form: { username: "", password: "", rememberMe: true } }),
      );
    });
  });

  describe("form not configured", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.appConfig.loginFormEnabled = false;
      fixture.detectChanges();
    });

    it("should not appear if not loginFormEnabled", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("form")).toBeNull();
    });
  });

  describe("form configured", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.appConfig.loginFormEnabled = true;
      fixture.detectChanges();
    });

    it("should  appear if not loginFormEnabled", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("form")).toBeTruthy();
    });
  });

  describe("oauth2 not configurated", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should not display OAuth2 provider", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("oauth-login-button")).toBeFalsy();
    });
  });

  describe("oauth2 configurated", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      const endpoint: OAuth2Endpoint = {
        displayText: "oauth provider",
        authURL: "/auth/foo",
      };
      component.appConfig.oAuth2Endpoints = [endpoint];
      fixture.detectChanges();
    });
    it("should display OAuth2 provider", () => {
      dispatchSpy = spyOn(component, "redirectOIDC");
      console.log(`!!!!!     ${component.document.location.href}`);
      component.redirectOIDC("/auth/foo");

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith("/auth/foo");
      console.log(`!!!!!     ${component.document.location.href}`);
      // expect(component.document.location.href).toEqual(`${appConfig.lbBaseURL}/auth/foo`);
    });
  });

  describe("should contain service account hint", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should contain service account hint", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.innerHTML).toContain("Service account username");
      expect(compiled.innerHTML).toContain("Service account password");
    });
  });

  describe("should contain facility hint", () => {
    let externalAuthEndpoint: string;
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      externalAuthEndpoint = "some/ext";
      component.appConfig.externalAuthEndpoint = externalAuthEndpoint;
      fixture.detectChanges();
    });
    it("should contain facility hint", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.innerHTML).toContain("not-ESS account username");
      expect(compiled.innerHTML).toContain("not-ESS account password");
    });
  });
});
