import { APP_CONFIG } from "app-config.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore } from "shared/MockStubs";
import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
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
import { rootReducer } from "state-management/reducers/root.reducer";
import { SharedCatanieModule } from "shared/shared.module";
import { DatePipe } from "@angular/common";
import { Proposal } from "shared/sdk";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
  setTextFilterAction,
  fetchProposalsAction
} from "state-management/actions/proposals.actions";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let fixture: ComponentFixture<ProposalDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalDashboardComponent],
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
        ReactiveFormsModule,
        SharedCatanieModule,
        StoreModule.forRoot({ rootReducer })
      ],
      providers: [DatePipe]
    });
    TestBed.overrideComponent(ProposalDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useValue: router }
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

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#formatTableData()", () => {
    it("should do nothing if there are no proposals", () => {
      const data = component.formatTableData(null);

      expect(data).toBeUndefined();
    });

    it("should return an array of data objects if proposals are defined", () => {
      const proposals = [new Proposal()];
      const data = component.formatTableData(proposals);

      expect(data.length).toEqual(1);
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction and a fetchProposalsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: query })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchProposalsAction());
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 100
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("onRowClick()", () => {
    it("should navigate to a proposal", () => {
      const proposal = new Proposal();
      component.onRowClick(proposal);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/proposals/" + proposal.proposalId
      );
    });
  });
});
