import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AnonymousDetailsDashboardComponent } from "./anonymous-details-dashboard.component";

describe("AnonymousDetailsDashboardComponent", () => {
  let component: AnonymousDetailsDashboardComponent;
  let fixture: ComponentFixture<AnonymousDetailsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousDetailsDashboardComponent]
    }).compileComponents();
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
