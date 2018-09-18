import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatTableModule, MatTabsModule } from "@angular/material";
import { ProposalDetailComponent } from "./proposal-detail.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("ProposalsDetailComponent", () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDetailComponent],
      imports: [MatTableModule, MatTabsModule, BrowserAnimationsModule]
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // TODO:
  // - test all combinations of email/name presence
  // - test with datasets
});
