import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { MatMenuTrigger } from "@angular/material/menu";
import { TableService } from "../../dynamic-mat-table.service";
import { ITableSetting } from "../../../models/table-setting.model";
import { isNullorUndefined } from "../../../cores/type";
import { AbstractField } from "../../../models/table-field.model";
import { Direction } from "@angular/cdk/bidi";
import {
  TableMenuAction,
  TableMenuActionChange,
} from "shared/modules/dynamic-material-table/models/table-menu.model";

@Component({
  selector: "table-menu",
  templateUrl: "./table-menu.component.html",
  styleUrls: ["./table-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableMenuComponent implements OnDestroy {
  @Output() menuActionChange: EventEmitter<TableMenuActionChange> =
    new EventEmitter<TableMenuActionChange>();

  @Input()
  get tableSetting(): ITableSetting {
    return this.currentTableSetting;
  }
  @Input() localization: string;

  set tableSetting(value: ITableSetting) {
    value.settingList =
      value.settingList === undefined ? [] : value.settingList;
    this.reverseDirection = value.direction === "rtl" ? "ltr" : "rtl";
    this.currentTableSetting = value;
  }

  get isSaveDataActive(): boolean {
    if (!this.tableSetting?.visibleActionMenu) {
      return false;
    } else {
      return (
        this.tableSetting.visibleActionMenu.csv !== false ||
        this.tableSetting.visibleActionMenu.json !== false ||
        this.tableSetting.visibleActionMenu.print !== false
      );
    }
  }

  @Output() tableSettingChange = new EventEmitter<ITableSetting>();

  @ViewChild("columnMenuTrigger") columnMenuTrigger: MatMenuTrigger;

  currentColumn: number = null;
  reverseDirection: "auto" | Direction = "auto";
  currentTableSetting: ITableSetting;

  private columnChange$ = new Subject<void>();
  private columnChangeSub: Subscription;

  constructor(
    public tableService: TableService,
    private cdr: ChangeDetectorRef,
  ) {
    this.columnChangeSub = this.columnChange$
      .pipe(debounceTime(600))
      .subscribe(() => this.saveColumnSettings());
  }

  ngOnDestroy(): void {
    this.columnChangeSub?.unsubscribe();
    this.columnChange$.complete();
  }

  private scheduleColumnSave() {
    this.columnChange$.next();
  }

  private saveColumnSettings() {
    this.menuActionChange.emit({
      type: TableMenuAction.TableSetting,
      data: this.currentTableSetting,
    });
    this.columnMenuTrigger?.closeMenu();
  }

  screenMode_onClick() {
    this.menuActionChange.emit({
      type: TableMenuAction.FullScreenMode,
      data: this.currentTableSetting,
    });
  }

  /***** Column Setting ******/
  onColumnMenuOpened() {
    this.cdr.markForCheck();
  }

  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.currentTableSetting.columnSetting,
      event.item.data.columnIndex,
      event.currentIndex,
    );
    this.scheduleColumnSave();
  }

  toggleSelectedColumn(column: AbstractField) {
    column.display = column.display === "visible" ? "hidden" : "visible";
    this.scheduleColumnSave();
  }

  onColumnSettingChange() {
    this.scheduleColumnSave();
  }

  setting_onClick(i) {
    this.currentColumn = i;
  }

  isVisible(visible: boolean) {
    return isNullorUndefined(visible) ? true : visible;
  }

  /*****  Save ********/
  resetDefaultSimple_onClick(e) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: TableMenuAction.DefaultSimpleSetting,
      data: null,
    });
  }

  /******* Save File (JSON, CSV, Print)***********/
  download_onClick(type: string) {
    this.menuActionChange.emit({ type: TableMenuAction.Download, data: type });
  }

  print_onClick(menu) {
    menu._overlayRef._host.parentElement.click();
    this.menuActionChange.emit({ type: TableMenuAction.Print, data: null });
  }
}
