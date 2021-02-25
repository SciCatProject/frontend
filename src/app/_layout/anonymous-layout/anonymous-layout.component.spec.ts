import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AnonymousLayoutComponent } from "./anonymous-layout.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoginHeaderComponent } from "_layout/login-header/login-header.component";
import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { RouterTestingModule } from "@angular/router/testing";
import { APP_CONFIG } from "app-config.module";
import { Store } from "@ngrx/store";
import { MockStore, MockActivatedRoute, MockRouter } from "shared/MockStubs";
import { ActivatedRoute, Router } from "@angular/router";

describe("AnonymousLayoutComponent", () => {
  let component: AnonymousLayoutComponent;
  let fixture: ComponentFixture<AnonymousLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AnonymousLayoutComponent, LoginHeaderComponent],
      imports: [BreadcrumbModule, RouterTestingModule]
    });
    TestBed.overrideComponent(LoginHeaderComponent, {
      set: {
        providers: [{ provide: APP_CONFIG, useValue: { facility: "ESS" } }]
      }
    });
    TestBed.overrideComponent(AnonymousLayoutComponent, {
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
    fixture = TestBed.createComponent(AnonymousLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
