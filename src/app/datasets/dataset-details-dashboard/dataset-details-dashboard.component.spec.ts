import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetDetailsDashboardComponent } from "./dataset-details-dashboard.component";

describe("DetailsDashboardComponent", () => {
  let component: DatasetDetailsDashboardComponent;
  let fixture: ComponentFixture<DatasetDetailsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetDetailsDashboardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
