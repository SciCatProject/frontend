import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule, MatIconModule } from "@angular/material";

import { LogbooksDashboardComponent } from "./logbooks-dashboard.component";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";

describe("DashboardComponent", () => {
  let component: LogbooksDashboardComponent;
  let fixture: ComponentFixture<LogbooksDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatCardModule, MatIconModule],
      declarations: [LogbooksDashboardComponent]
    });
    TestBed.overrideComponent(LogbooksDashboardComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbooksDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
