import { APP_CONFIG } from "./../../../app-config.module";
import { MockStore } from "./../../../shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ProposalsListComponent } from "./proposals-list.component";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import {
  MatListModule,
  MatTableModule,
  MatPaginatorModule
} from "@angular/material";
import { Proposal } from "shared/sdk";
import {
  FetchProposalAction,
  SortProposalByColumnAction,
  ChangePageAction
} from "state-management/actions/proposals.actions";
import { rootReducer } from "state-management/reducers/root.reducer";
import { SortChangeEvent } from "datasets";

describe("ProposalsListComponent", () => {
  let component: ProposalsListComponent;
  let fixture: ComponentFixture<ProposalsListComponent>;

  let router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProposalsListComponent],
      imports: [
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        RouterTestingModule,
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.overrideComponent(ProposalsListComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalsListComponent);
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

  describe("#onRowSelect()", () => {
    it("should dispatch a FetchProposalAction and navigate to a proposal", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new Event("click");
      component.proposals = [new Proposal()];

      component.onRowSelect(event, component.proposals[0]);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new FetchProposalAction(component.proposals[0].proposalId)
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/proposals/" + encodeURIComponent(component.proposals[0].proposalId)
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a SortProposalByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "createdBy",
        direction: "asc"
      };

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SortProposalByColumnAction(event.active, event.direction)
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a ChangePageAction and update page", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {
        pageIndex: 0,
        pageSize: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new ChangePageAction(event.pageIndex, event.pageSize)
      );
      expect(component.page).toEqual(event.pageIndex);
    });
  });
});
