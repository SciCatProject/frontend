import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AnonymousDetailsDashboardComponent } from "./anonymous-details-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigModule, APP_CONFIG } from "app-config.module";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "shared/MockStubs";

describe("AnonymousDetailsDashboardComponent", () => {
  let component: AnonymousDetailsDashboardComponent;
  let fixture: ComponentFixture<AnonymousDetailsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AnonymousDetailsDashboardComponent],
      imports: [AppConfigModule, SharedCatanieModule, StoreModule.forRoot({})]
    });
    TestBed.overrideComponent(AnonymousDetailsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: APP_CONFIG, useValue: { editMetadataEnabled: true } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
