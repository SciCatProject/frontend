import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts";
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
      name: "title",
      icon: "description",
      sort: true,
      inList: true,
    },
    {
      name: "firstname",
      icon: "badge",
      sort: true,
      inList: true,
    },
    {
      name: "lastname",
      icon: "badge",
      sort: true,
      inList: true,
    },
    {
      name: "startTime",
      icon: "timer",
      sort: true,
      inList: true,
    },
    {
      name: "endTime",
      icon: "timer_off",
      sort: true,
      inList: true,
    },
  ];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store,
  ) {}

  // formatTableData(datasets: ProposalClass[]): Record<string, unknown>[] {
  //   if (!datasets) {
  //     return [];
  //   }

  //   return datasets.map((dataset) => ({
  //     pid: dataset.proposalId,
  //     name: dataset.title,
  //     sourceFolder: dataset.sourceFolder,
  //     size: dataset.size,
  //     type: dataset.type,
  //     creationTime: this.datePipe.transform(
  //       dataset.creationTime,
  //       "yyyy-MM-dd, hh:mm",
  //     ),
  //     owner: dataset.owner,
  //   }));
  // }

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
