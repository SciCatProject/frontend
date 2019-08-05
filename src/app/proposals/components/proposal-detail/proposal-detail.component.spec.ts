import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule, MatTabsModule } from "@angular/material";
import { MockRouter, MockStore } from "shared/MockStubs";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalDetailComponent } from "./proposal-detail.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule, Store } from "@ngrx/store";
import { proposalsReducer } from "state-management/reducers/proposals.reducer";
import { SharedCatanieModule } from "shared/shared.module";

describe("ProposalsDetailComponent", () => {
  let component: ProposalDetailComponent;
  let fixture: ComponentFixture<ProposalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalDetailComponent],
      imports: [
        MatTableModule,
        MatTabsModule,
        BrowserAnimationsModule,
        SharedCatanieModule,
        StoreModule.forRoot({
          proposals: proposalsReducer
        })
      ]
    });
    TestBed.overrideComponent(ProposalDetailComponent, {
      set: {
        providers: [
          { provide: Router, useClass: MockRouter },
          { provide: Store, useClass: MockStore }
        ]
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
