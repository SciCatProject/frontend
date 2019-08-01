import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { ProposalSearchComponent } from "proposals/proposal-search/proposal-search.component";
import { ListProposalsPageComponent } from "proposals/containers/list-proposals-page/list-proposals-page.component";
import { APP_CONFIG } from "app-config.module";
import { Store } from "@ngrx/store";
import { MatDialog, MatPaginator, MatPaginatorModule, MatInputModule, MatFormFieldModule } from "@angular/material";
import { Router } from "@angular/router";
import { MockRouter, MockStore } from "shared/MockStubs";
import { ProposalsListComponent } from "proposals/components/proposals-list/proposals-list.component";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let fixture: ComponentFixture<ProposalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProposalDashboardComponent,
        ListProposalsPageComponent,
        ProposalsListComponent,
        ProposalSearchComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ]
    });
    TestBed.overrideComponent(ProposalDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: Store, useClass: MockStore },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useClass: MockRouter }
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
