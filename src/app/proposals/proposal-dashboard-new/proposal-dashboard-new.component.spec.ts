import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProposalDashboardNewComponent } from "./proposal-dashboard-new.component";

describe("ProposalDashboardNewComponent", () => {
  let component: ProposalDashboardNewComponent;
  let fixture: ComponentFixture<ProposalDashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalDashboardNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
