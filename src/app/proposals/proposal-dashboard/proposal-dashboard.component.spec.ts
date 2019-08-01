import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { ProposalSearchComponent } from "proposals/proposal-search/proposal-search.component";
import { ListProposalsPageComponent } from "proposals/containers/list-proposals-page/list-proposals-page.component";
import { APP_CONFIG } from "app-config.module";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { MockRouter, MockStore } from "shared/MockStubs";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let fixture: ComponentFixture<ProposalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProposalDashboardComponent,
        ListProposalsPageComponent,
        ProposalSearchComponent
      ]
    });
    TestBed.overrideComponent(ProposalDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: Store, useClass: MockStore },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useClass: MockRouter },
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
