import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { LoginLayoutComponent } from "./login-layout.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoginHeaderComponent } from "_layout/login-header/login-header.component";
import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { APP_CONFIG } from "app-config.module";
import { Store } from "@ngrx/store";
import { MockStore, MockActivatedRoute, MockRouter } from "shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";

describe("LoginLayoutComponent", () => {
  let component: LoginLayoutComponent;
  let fixture: ComponentFixture<LoginLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LoginLayoutComponent, LoginHeaderComponent],
      imports: [BreadcrumbModule, MatToolbarModule]
    });
    TestBed.overrideComponent(LoginHeaderComponent, {
      set: {
        providers: [{ provide: APP_CONFIG, useValue: { facility: "ESS" } }]
      }
    });
    TestBed.overrideComponent(LoginLayoutComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
