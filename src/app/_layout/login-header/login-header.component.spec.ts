import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { LoginHeaderComponent } from "./login-header.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { APP_CONFIG } from "app-config.module";

describe("LoginHeaderComponent", () => {
  let component: LoginHeaderComponent;
  let fixture: ComponentFixture<LoginHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LoginHeaderComponent],
      imports: [MatToolbarModule]
    });
    TestBed.overrideComponent(LoginHeaderComponent, {
      set: {
        providers: [{ provide: APP_CONFIG, useValue: { facility: "ESS" } }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
