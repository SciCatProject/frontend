import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { Store, StoreModule } from "@ngrx/store";
import { rootReducer } from "state-management/reducers/root.reducer";
import { MatMenuModule, MatSnackBarModule } from "@angular/material";
import { AppComponent } from "./app.component";
import { BreadcrumbComponent } from "./shared/modules/breadcrumb/breadcrumb.component";
import { MockStore } from "./shared/MockStubs";
import { APP_CONFIG } from "./app-config.module";
import { LoginService } from "users/login.service";

import {
  MockLoginService
} from "shared/MockStubs";

/* tslint:disable:no-unused-variable */

describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatMenuModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientModule,
        StoreModule.forRoot({ rootReducer })
      ],
      declarations: [AppComponent, BreadcrumbComponent]
    });
    TestBed.overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: LoginService, useClass: MockLoginService },
          // {provide : Router, useClass : MockRouter},
          { provide: Store, useClass: MockStore },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              facility: "ESS"
            }
          }
        ]
      }
    });
    TestBed.compileComponents();
  });

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.get(Store);
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'SciCat'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.get(Store);
    expect(app.title).toContain("SciCat");
  }));
});
