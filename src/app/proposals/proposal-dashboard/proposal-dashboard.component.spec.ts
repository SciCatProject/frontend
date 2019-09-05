import { APP_CONFIG } from "app-config.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListProposalsPageComponent } from "proposals/containers/list-proposals-page/list-proposals-page.component";
import { MockRouter, MockStore } from "shared/MockStubs";
import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { ProposalSearchComponent } from "proposals/proposal-search/proposal-search.component";
import { ProposalsListComponent } from "proposals/components/proposals-list/proposals-list.component";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialog,
  MatPaginatorModule,
  MatInputModule,
  MatFormFieldModule,
  MatTableModule,
  MatCardModule,
  MatListModule,
  MatDividerModule,
  MatIconModule
} from "@angular/material";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";

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
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
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
