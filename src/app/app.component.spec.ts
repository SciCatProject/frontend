import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AppComponent } from "./app.component";
import { MockStore } from "./shared/MockStubs";
import { APP_CONFIG } from "./app-config.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AppConfigService } from "app-config.service";
import { Configuration } from "@scicatproject/scicat-sdk-ts";

describe("AppComponent", () => {
  const getConfig = () => ({
    facility: "ESS",
    lbBaseUrl: "https://backend.com",
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatProgressSpinnerModule,
        MatSnackBarModule,
        StoreModule.forRoot({}),
      ],
      declarations: [AppComponent],
    });
    TestBed.overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: AppConfigService, useValue: { getConfig } },
          {
            provide: Configuration,
            useClass: Configuration,
          },
          {
            provide: APP_CONFIG,
            useValue: {
              facility: "ESS",
            },
          },
        ],
      },
    });
    TestBed.compileComponents();
  });

  it("should create the app", waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.inject(Store);
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'SciCat'`, waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.store = TestBed.inject(Store);
    expect(app.title).toContain("SciCat");
  }));
});
