import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleDashboardComponent } from "./sample-dashboard.component";
import { SampleSearchComponent } from "samples/sample-search/sample-search.component";
import { SampleTableComponent } from "samples/sample-table/sample-table.component";
import { MatTableModule } from "@angular/material";

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
    }).compileComponents();
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
