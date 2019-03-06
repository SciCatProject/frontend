import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FileSizePipe } from "../../../shared/pipes";
import { MatTableModule, MatTabsModule } from "@angular/material";
import { MockRouter } from "shared/MockStubs";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalDetailComponent } from "./proposal-detail.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import { proposalsReducer } from "state-management/reducers/proposals.reducer";

describe("ProposalsDetailComponent", () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDetailComponent, FileSizePipe],
      imports: [MatTableModule, MatTabsModule, BrowserAnimationsModule, StoreModule.forRoot({
        proposals: proposalsReducer
      })]
    });
    TestBed.overrideComponent(ProposalDetailComponent, {
      set: {
        providers: [{ provide: Router, useClass: MockRouter }]
      }
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
