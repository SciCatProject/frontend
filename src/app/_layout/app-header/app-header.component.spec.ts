import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppHeaderComponent } from "./app-header.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatMenuModule, MatToolbarModule } from "@angular/material";
import { LoginService } from "users/login.service";
import { MockLoginService, MockStore } from "shared/MockStubs";
import { Store } from "@ngrx/store";
import { APP_CONFIG } from "app-config.module";

describe("AppHeaderComponent", () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppHeaderComponent],
      imports: [MatMenuModule, MatToolbarModule]
    });
    TestBed.overrideComponent(AppHeaderComponent, {
      set: {
        providers: [
          { provide: LoginService, useClass: MockLoginService },
          { provide: Store, useClass: MockStore },
          { provide: APP_CONFIG, useValue: { facility: "ESS" } }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
