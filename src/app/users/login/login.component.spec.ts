import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  MockActivatedRoute,
  MockAuthService,
  MockLoopBackAuth,
  MockRouter,
  MockStore
} from "shared/MockStubs";
import { LoopBackAuth } from "shared/sdk/services";

import { ADAuthService } from "../adauth.service";
import { LoginComponent } from "./login.component";
import {
  MatCheckboxModule,
  MatCardModule,
  MatGridListModule
} from "@angular/material";
import { APP_CONFIG, AppConfigModule } from "app-config.module";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppConfigModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatCardModule,
        MatGridListModule
      ],
      declarations: [LoginComponent]
    });
    TestBed.overrideComponent(LoginComponent, {
      set: {
        // These should sync up with what is in the constructor, they do NOT need to be provided in the config for the testing module
        providers: [
          // { provide: ADAuthService, useClass: MockAuthService },
          // { provide: LoopBackAuth, useClass: MockLoopBackAuth },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore }
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

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should contain username and password fields", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("form").textContent).toContain("Username");
    expect(compiled.querySelector("form").textContent).toContain("Password");
  });
});
