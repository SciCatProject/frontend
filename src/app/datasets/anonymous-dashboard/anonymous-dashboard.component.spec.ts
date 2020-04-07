import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AnonymousDashboardComponent } from "./anonymous-dashboard.component";

describe("AnonymousDashboardComponent", () => {
  let component: AnonymousDashboardComponent;
  let fixture: ComponentFixture<AnonymousDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnonymousDashboardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
