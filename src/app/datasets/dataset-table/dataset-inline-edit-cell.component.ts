import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription } from "rxjs";
import { get as lodashGet, set as lodashSet } from "lodash-es";
import { AppConfigService } from "app-config.service";
import { updatePropertyInlineAction } from "state-management/actions/datasets.actions";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  DynamicMatTableComponent,
  IDynamicCell,
} from "shared/modules/dynamic-material-table/table/dynamic-mat-table.component";

@Component({
  selector: "dataset-inline-edit-cell",
  templateUrl: "./dataset-inline-edit-cell.component.html",
  styleUrls: ["./dataset-inline-edit-cell.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DatasetInlineEditCellComponent
  implements IDynamicCell, OnInit, OnChanges, OnDestroy
{
  private subscriptions: Subscription[] = [];
  private accessGroups: string[] = [];
  private isAdmin = false;
  private appConfig = this.appConfigService.getConfig();

  @Input() row: OutputDatasetObsoleteDto;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onRowEvent = null;

  @ViewChild("valueInput") valueInput?: ElementRef<HTMLInputElement>;

  isEditing = false;
  isSaving = false;
  draftValue = "";

  get canEdit(): boolean {
    return (
      !!this.row?.pid &&
      ((this.appConfig.editDatasetEnabled &&
        !!this.row?.ownerGroup &&
        this.accessGroups.includes(this.row.ownerGroup)) ||
        this.isAdmin)
    );
  }

  get fieldPath(): string {
    return this.column?.path || this.column?.name || "";
  }

  get displayValue(): string {
    if (!this.row || !this.column) {
      return "";
    }

    const value = this.column.customRender
      ? this.column.customRender(this.column, this.row)
      : lodashGet(this.row, this.fieldPath);

    return value == null ? "" : String(value);
  }

  constructor(
    private appConfigService: AppConfigService,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(selectProfile).subscribe((profile) => {
        this.accessGroups = profile?.accessGroups ?? [];
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.push(
      this.store.select(selectIsAdmin).subscribe((isAdmin) => {
        this.isAdmin = !!isAdmin;
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.row || changes.column) {
      this.draftValue = this.rawValue;
    }
  }

  beginEdit(event: Event): void {
    event.stopPropagation();

    if (!this.canEdit || this.isSaving) {
      return;
    }

    this.isEditing = true;
    this.draftValue = this.rawValue;
    this.cdr.markForCheck();

    setTimeout(() => {
      const input = this.valueInput?.nativeElement;
      input?.focus();
      input?.select();
    });
  }

  saveValue(event?: Event): void {
    event?.stopPropagation();

    if (!this.isEditing || this.isSaving || !this.row?.pid) {
      return;
    }

    const nextValue = this.draftValue ?? "";
    const currentValue = this.rawValue;

    if (nextValue === currentValue) {
      this.isEditing = false;
      this.cdr.markForCheck();
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    try {
      this.store.dispatch(
        updatePropertyInlineAction({
          pid: this.row.pid,
          property: { ...lodashSet({}, this.fieldPath, nextValue) },
        }),
      );
      lodashSet(this.row, this.fieldPath, nextValue);
      this.isEditing = false;
    } catch {
      this.store.dispatch(
        showMessageAction({
          message: {
            content: `Failed to update dataset ${this.column?.header || this.fieldPath}.`,
            type: MessageType.Error,
            duration: 5000,
          },
        }),
      );
    } finally {
      this.isSaving = false;
      this.cdr.markForCheck();
    }
  }

  cancelEdit(event?: Event): void {
    event?.stopPropagation();
    this.draftValue = this.rawValue;
    this.isEditing = false;
    this.cdr.markForCheck();
  }

  onCellClick(event: Event): void {
    if (!this.canEdit) {
      return;
    }

    if (this.isEditing) {
      event.stopPropagation();
      return;
    }

    this.beginEdit(event);
  }

  onCellMouseDown(event: Event): void {
    if (this.canEdit) {
      event.stopPropagation();
    }
  }

  onCellDoubleClick(event: Event): void {
    if (this.canEdit) {
      event.stopPropagation();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private get rawValue(): string {
    const value = lodashGet(this.row, this.fieldPath);
    return value == null ? "" : String(value);
  }
}
