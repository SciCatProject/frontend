import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalDetailComponent } from "./proposal-detail.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

describe("ProposalsDetailComponent", () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
