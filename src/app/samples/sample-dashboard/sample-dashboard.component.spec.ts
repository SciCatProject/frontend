import { APP_CONFIG } from "app-config.module";
import { MatTableModule, MatDialog } from "@angular/material";
import { MockStore, MockRouter } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { SampleDashboardComponent } from "./sample-dashboard.component";
import { SampleSearchComponent } from "samples/sample-search/sample-search.component";
import { SampleTableComponent } from "samples/sample-table/sample-table.component";
import { Store } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

describe("SampleDashboardComponent", () => {
  let component: SampleDashboardComponent;
  let fixture: ComponentFixture<SampleDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule
      ],
      declarations: [
        SampleDashboardComponent,
        SampleSearchComponent,
        SampleTableComponent
      ]
    });
    TestBed.overrideComponent(SampleDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: Store, useClass: MockStore },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useClass: MockRouter },
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
