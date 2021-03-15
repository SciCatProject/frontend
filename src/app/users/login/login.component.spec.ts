import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { MockActivatedRoute, MockRouter, MockStore } from "shared/MockStubs";

import { LoginComponent } from "./login.component";

import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { loginAction } from "state-management/actions/user.actions";
import { PrivacyDialogComponent } from "users/privacy-dialog/privacy-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        AppConfigModule,
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        StoreModule.forRoot({})
      ]
    });
    TestBed.overrideComponent(LoginComponent, {
      set: {
        // These should sync up with what is in the constructor, they do NOT need to be provided in the config for the testing module
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should contain username and password fields", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("form").textContent).toContain("Username");
    expect(compiled.querySelector("form").textContent).toContain("Password");
  });

  describe("#openPrivacyDialog()", () => {
    it("should open the privacy dialog", () => {
      spyOn(component.dialog, "open");

      component.openPrivacyDialog();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        PrivacyDialogComponent,
        { width: "auto" }
      );
    });
  });

  describe("#onLogin()", () => {
    it("should dispatch a loginAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onLogin();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        loginAction({ form: { username: "", password: "", rememberMe: true } })
      );
    });
  });
});
