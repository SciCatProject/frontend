import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InstrumentsDashboardComponent } from "./instruments-dashboard.component";

describe("InstrumentsDashboardComponent", () => {
  let component: InstrumentsDashboardComponent;
  let fixture: ComponentFixture<InstrumentsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InstrumentsDashboardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
