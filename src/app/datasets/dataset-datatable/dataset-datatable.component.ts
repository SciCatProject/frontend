import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as webix from "webix/webix.js";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  clearSelectionAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/datasets.actions";
import {
  selectDatasets,
  selectDatasetsPerPage,
  selectPage,
  selectTotalSets,
  selectDatasetsInBatch,
} from "state-management/selectors/datasets.selectors";
import { Dataset, TableColumn } from "state-management/models";
import { AppConfigService } from "app-config.service";
import { selectCurrentUser } from "state-management/selectors/user.selectors";

@Component({
  selector: "app-webix-datatable",
  template: `<div #container class="webix-datatable"></div>`,
  styleUrls: ["./dataset-datatable.component.scss"],
})
export class WebixDatatableComponent implements OnInit, OnDestroy, OnChanges {
  private inBatchPids: string[] = [];
  private subscriptions: Subscription[] = [];
  private webixUi: any;

  @ViewChild("container", { static: true }) container!: ElementRef;

  @Input() tableColumns: TableColumn[] | null = null;
  @Input() selectedSets: Dataset[] | null = null;
  @Output() settingsClick = new EventEmitter<MouseEvent>();
  @Output() rowClick = new EventEmitter<Dataset>();

  datasets: Dataset[] = [];

  constructor(
    private store: Store,
    public appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.initializeWebixTable();

    this.subscriptions.push(
      this.store.select(selectDatasetsInBatch).subscribe((datasets) => {
        this.inBatchPids = datasets.map((dataset) => dataset.pid);
      }),
    );

    this.subscriptions.push(
      this.store.select(selectDatasets).subscribe((datasets) => {
        this.store.select(selectCurrentUser).subscribe((currentUser) => {
          const publishedDatasets = datasets.filter(
            (dataset) => dataset.isPublished,
          );
          this.datasets = currentUser ? datasets : publishedDatasets;
          this.updateWebixTable();
        });
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tableColumns"]) {
      this.updateWebixTableColumns();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    if (this.webixUi) {
      this.webixUi.destructor();
    }
  }

  initializeWebixTable(): void {
    this.webixUi = webix.ui({
      container: this.container.nativeElement,
      view: "datatable",
      columns: this.getWebixColumns(),
      autoheight: true,
      // autoConfig: true,
      data: this.datasets,
      select: "row",
      scrollX: false,
      resizeColumn: true,
      css: "webix_header_border",
      hover: "webix_row_select",
      on: {
        onItemClick: (id) => {
          const dataset = this.datasets.find((data) => data.pid === id.row);
          if (dataset) {
            this.rowClick.emit(dataset);
          }
        },
        onAfterSelect: (id) => {
          const dataset = this.datasets.find((data) => data.pid === id.row);
          if (dataset) {
            this.store.dispatch(selectDatasetAction({ dataset }));
          }
        },
        onAfterUnSelect: (id) => {
          const dataset = this.datasets.find((data) => data.pid === id.row);
          if (dataset) {
            this.store.dispatch(deselectDatasetAction({ dataset }));
          }
        },
        onHeaderClick: (id) => {
          this.webixUi.adjustColumn(id.column);
        },
      },
      // pager: {
      //   container: this.container.nativeElement,
      //   size: 25,
      //   group: 5,
      //   on: {
      //     onItemClick: (id) => {
      //       const pageIndex = id - 1;
      //       const pageSize = 50; // Or dynamically fetch based on user settings
      //       this.onPageChange({ pageIndex, pageSize });
      //     },
      //   },
      // },
    });
  }

  replaceHeaderWithFilter(columnId: string): void {
    const columnConfig = this.webixUi.getColumnConfig(columnId);
    const originalHeader = columnConfig.header[0].text;

    columnConfig.header[0] = {
      content: "textFilter",
      inputConfig: {
        readonly: true,
        on: {
          onClick: () => {
            alert("clicked");
          },
          onTimedKeyPress: function () {
            if (this.getValue() === "") {
              columnConfig.header[0] = originalHeader;
              this.getTopParentView().refreshColumns();
            }
          },
        },
      },
    };
    this.webixUi.refreshColumns();
  }

  getWebixColumns(): any[] {
    return [
      {
        id: "pid",
        header: [{ text: "PID" }, { content: "textFilter" }],
        adjust: true,
      },
      { id: "datasetName", header: "Name", sort: "text", adjust: true },
      { id: "runNumber", header: "Run Number", adjust: true },
      { id: "sourceFolder", header: "Source Folder", fillspace: true },
      {
        id: "size",
        header: "Size",
        adjust: true,
        sort: "int",
        format: (value) => `${(value / 1024 ** 3).toFixed(2)} GiB`,
      },
      {
        id: "creationTime",
        header: "Creation Time",
        adjust: true,
        sort: "date",
      },
      { id: "type", header: "Type", adjust: true, sort: "text" },
      {
        id: "image",
        header: `<span class="fa fa-image"></span>`,
        width: 120,
      },
      { id: "metadata", header: "Metadata", adjust: true },
      { id: "proposalId", header: "Proposal Id", adjust: true },
      { id: "ownerGroup", header: "Owner Group", sort: "text", adjust: true },
      { id: "dataStatus", header: "Data Status", adjust: true },
    ];
  }

  updateWebixTable(): void {
    if (this.webixUi) {
      this.webixUi.clearAll();
      this.webixUi.parse(this.datasets);
    }
  }

  updateWebixTableColumns(): void {
    if (this.webixUi) {
      this.webixUi.config.columns = this.getWebixColumns();
      this.webixUi.refreshColumns();
    }
  }

  onSortChange(event: { active: string; direction: string }): void {
    let column = event.active.split("_")[1];
    if (column === "runNumber") column = "scientificMetadata.runNumber.value";
    this.store.dispatch(
      sortByColumnAction({ column, direction: event.direction }),
    );
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize }),
    );
  }
}
