import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  fromEvent,
  Subscription,
  take,
  combineLatest,
} from "rxjs";
import { selectSampleDetailPageViewModel } from "../../state-management/selectors/samples.selectors";
import { Store } from "@ngrx/store";
import {
  fetchSampleAction,
  fetchSampleDatasetsAction,
  changeDatasetsPageAction,
  saveCharacteristicsAction,
  addAttachmentAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  fetchSampleAttachmentsAction,
} from "../../state-management/actions/samples.actions";
import {
  PickedFile,
  SubmitCaptionEvent,
} from "shared/modules/file-uploader/file-uploader.component";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { AppConfigService } from "app-config.service";
import {
  CreateAttachmentV3Dto,
  OutputAttachmentV3Dto,
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
  OutputSampleDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { TableColumn } from "state-management/models";
import { selectColumnsWithHasFetchedSettings } from "state-management/selectors/user.selectors";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"],
  standalone: false,
})
export class SampleDetailComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private _hasUnsavedChanges = false;
  vm$ = this.store.select(selectSampleDetailPageViewModel);

  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );

  tableName = "sampleDatasetsTable";

  columns: TableField<any>[];

  setting: ITableSetting = {};

  appConfig = this.appConfigService.getConfig();

  sample: OutputSampleDto;
  user: ReturnedUserDto;
  attachment: CreateAttachmentV3Dto;
  attachments: OutputAttachmentV3Dto[] = [];
  show = false;
  subscriptions: Subscription[] = [];

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    saveSettingMode: "none",
    settingList: [
      {
        visibleActionMenu: actionMenu,
        saveSettingMode: "none",
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  dataSource: BehaviorSubject<OutputDatasetObsoleteDto[]> = new BehaviorSubject<
    OutputDatasetObsoleteDto[]
  >([]);

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {
    pageSizeOptions: [5, 10, 25, 50, 100],
    pageIndex: 0,
    pageSize: 25,
    length: 0,
  };

  rowSelectionMode: TableSelectionMode = "none";

  constructor(
    private appConfigService: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private tableConfigService: TableConfigService,
    private datasetsListService: DatasetsListService,
  ) {}

  initTable(
    settingConfig: ITableSetting,
    paginationConfig: TablePagination,
  ): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  onSaveCharacteristics(characteristics: Record<string, unknown>) {
    this.store.dispatch(
      saveCharacteristicsAction({
        sampleId: this.sample.sampleId,
        characteristics,
      }),
    );
  }

  onFilePicked(file: PickedFile) {
    this.attachment = {
      thumbnail: file.content,
      caption: file.name,
      ownerGroup: this.sample.ownerGroup,
      accessGroups: this.sample.accessGroups,
      sampleId: this.sample.sampleId,
    };
    this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
  }

  updateCaption(event: SubmitCaptionEvent) {
    const { attachmentId, caption } = event;
    this.store.dispatch(
      updateAttachmentCaptionAction({
        sampleId: this.sample.sampleId,
        attachmentId,
        caption,
      }),
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(
      removeAttachmentAction({ sampleId: this.sample.sampleId, attachmentId }),
    );
  }

  onPaginationChange({ pageIndex, pageSize }: TablePagination) {
    this.store.dispatch(
      changeDatasetsPageAction({
        page: pageIndex,
        limit: pageSize,
      }),
    );
    this.store.dispatch(
      fetchSampleDatasetsAction({ sampleId: this.sample.sampleId }),
    );
  }

  onRowEvent(event: IRowEvent<OutputDatasetObsoleteDto>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.pid);
      this.router.navigateByUrl("/datasets/" + id);
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([
        this.vm$,
        this.selectColumnsWithFetchedSettings$.pipe(take(1)),
      ]).subscribe(([vm, defaultTableColumns]) => {
        if (vm.sample) {
          this.sample = vm.sample;

          if (!this.sample.sampleCharacteristics) {
            this.sample.sampleCharacteristics = {};
          }
        }

        if (vm.attachments) {
          this.attachments = vm.attachments;
        }

        this.dataSource.next(vm.datasets);

        const defaultConfigColumns =
          this.appConfig?.defaultDatasetsListSettings?.columns || [];

        const userTableConfigColumns =
          this.datasetsListService.convertSavedDatasetColumns(
            defaultTableColumns.columns,
          );

        this.tableDefaultSettingsConfig.settingList[0].columnSetting =
          this.datasetsListService.convertSavedDatasetColumns(
            defaultConfigColumns as TableColumn[],
          );

        const tableSettingsConfig =
          this.tableConfigService.getTableSettingsConfig(
            this.tableName,
            this.tableDefaultSettingsConfig,
            userTableConfigColumns,
          );

        const paginationConfig = {
          pageSizeOptions: [5, 10, 25, 50, 100],
          pageIndex: vm.datasetsPage || 0,
          pageSize: vm.datasetsPerPage || this.pagination.pageSize,
          length: vm.datasetsCount || 0,
        };

        if (tableSettingsConfig?.settingList.length) {
          this.initTable(tableSettingsConfig, paginationConfig);
        }
        this.pagination = {
          ...this.pagination,
          pageIndex: vm.datasetsPage || 0,
          pageSize: vm.datasetsPerPage || this.pagination.pageSize,
          length: vm.datasetsCount || 0,
        };
      }),
    );
    // Prevent user from reloading page if there are unsave changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );

    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.user) {
          this.user = vm.user;
        }
      }),
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.store.dispatch(fetchSampleAction({ sampleId: params.id }));
        this.store.dispatch(
          fetchSampleAttachmentsAction({ sampleId: params.id }),
        );
        this.store.dispatch(fetchSampleDatasetsAction({ sampleId: params.id }));
      }),
    );
  }
  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }

  emptyMetadataTable(): boolean {
    if (this.appConfig.hideEmptyMetadataTable) {
      return (
        !!this.sample?.sampleCharacteristics &&
        Object.keys(this.sample.sampleCharacteristics).length > 0
      );
    }
    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
