import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import {
  PageChangeEvent,
  TableColumn,
} from "shared/modules/table/table.component";
import {
  changeRelatedProposalsPageAction,
  clearProposalsStateAction,
  fetchRelatedProposalsAction,
} from "state-management/actions/proposals.actions";
import {
  selectRelatedProposalsCurrentPage,
  selectRelatedProposalsPageViewModel,
  selectRelatedProposalsPerPage,
} from "state-management/selectors/proposals.selectors";

@Component({
  selector: "app-related-proposals",
  templateUrl: "./related-proposals.component.html",
  styleUrls: ["./related-proposals.component.scss"],
})
export class RelatedProposalsComponent implements OnInit {
  vm$ = this.store.select(selectRelatedProposalsPageViewModel);
  currentPage$ = this.store.select(selectRelatedProposalsCurrentPage);
  proposalsPerPage$ = this.store.select(selectRelatedProposalsPerPage);

  tablePaginate = true;
  tableColumns: TableColumn[] = [
    {
      name: "proposalId",
      icon: "perm_device_information",
      sort: true,
      inList: true,
    },
    {
      name: "relation",
      icon: "compare_arrows",
      sort: true,
      inList: true,
    },
    {
      name: "title",
      icon: "description",
      sort: true,
      inList: true,
    },
    {
      name: "abstract",
      icon: "description",
      sort: true,
      inList: true,
    },
    {
      name: "email",
      icon: "badge",
      sort: true,
      inList: true,
    },
    {
      name: "type",
      icon: "text_format",
      sort: true,
      inList: true,
    },
  ];

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit() {
    this.store.dispatch(fetchRelatedProposalsAction());
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(
      changeRelatedProposalsPageAction({
        page: event.pageIndex,
        limit: event.pageSize,
      }),
    );
    this.store.dispatch(fetchRelatedProposalsAction());
  }

  onRowClick(proposal: ProposalClass): void {
    this.store.dispatch(clearProposalsStateAction());
    const pid = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl("/proposals/" + pid);
  }
}
