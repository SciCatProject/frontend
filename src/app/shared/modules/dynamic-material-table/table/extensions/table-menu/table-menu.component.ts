import {
  ChangeDetectionStrategy,
  Component,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { TableService } from "../../dynamic-mat-table.service";
import { TableSetting } from "../../../models/table-setting.model";
import { deepClone, isNullorUndefined } from "../../../cores/type";
import { AbstractField } from "../../../models/table-field.model";
import { Direction } from "@angular/cdk/bidi";

@Component({
  selector: "table-menu",
  templateUrl: "./table-menu.component.html",
  styleUrls: ["./table-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent {
  @Output() menuActionChange: EventEmitter<TableMenuActionChange> =
    new EventEmitter<TableMenuActionChange>();

  @Input()
  get tableSetting(): TableSetting {
    return this.currentTableSetting;
  }

  set tableSetting(value: TableSetting) {
    value.settingList =
      value.settingList === undefined ? [] : value.settingList;
    this.originalTableSetting = value;
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

  @Output() tableSettingChange = new EventEmitter<TableSetting>();
  @ViewChild("newSetting", { static: false }) newSettingElement: ElementRef;

  newSettingName = "";
  showNewSetting = false;

  currentColumn: number = null;
  reverseDirection: "auto" | Direction = "auto";
  originalTableSetting: TableSetting;
  currentTableSetting: TableSetting;

  constructor(public tableService: TableService) {}

  screenMode_onClick() {
    this.menuActionChange.emit({
      type: "FullScreenMode",
      data: this.currentTableSetting,
    });
  }

  /***** Column Setting ******/
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.currentTableSetting.columnSetting,
      event.item.data.columnIndex,
      event.currentIndex,
    );
  }

  toggleSelectedColumn(column: AbstractField) {
    column.display = column.display === "visible" ? "hidden" : "visible";
  }

  apply_onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.menuActionChange.emit({
      type: "TableSetting",
      data: this.currentTableSetting,
    });
    this.tableService.saveColumnInfo(this.currentTableSetting.columnSetting);
  }

  setting_onClick(i) {
    this.currentColumn = i;
  }

  cancel_onClick() {
    this.currentTableSetting = deepClone(this.originalTableSetting);
  }

  isVisible(visible: boolean) {
    return isNullorUndefined(visible) ? true : visible;
  }

  /*****  Save ********/
  saveSetting_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: "SaveSetting",
      data: setting?.settingName,
    });
  }

  newSetting_onClick(e) {
    this.showNewSetting = true;
    this.newSettingName = "";
    window.requestAnimationFrame(() => {
      this.newSettingElement.nativeElement.focus();
    });
    e.stopPropagation();
  }

  selectSetting_onClick(e, setting: TableSetting) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: "SelectSetting",
      data: setting.settingName,
    });
  }

  resetDefault_onClick(e) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: "SelectSetting",
      data: null,
    });
  }

  default_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: "DefaultSetting",
      data: setting.settingName,
    });
  }

  applySaveSetting_onClick(e) {
    e.stopPropagation();
    this.menuActionChange.emit({
      type: "SaveSetting",
      data: this.newSettingName,
    });
    this.showNewSetting = false;
  }

  cancelSaveSetting_onClick(e) {
    e.stopPropagation();
    this.newSettingName = "";
    this.showNewSetting = false;
  }

  deleteSetting_onClick(e, setting) {
    e.stopPropagation();
    this.menuActionChange.emit({ type: "DeleteSetting", data: setting });
    this.newSettingName = "";
    this.showNewSetting = false;
  }

  /*****  Filter ********/
  clearFilter_onClick() {
    this.menuActionChange.emit({ type: "FilterClear" });
  }

  /******* Save File (JSON, CSV, Print)***********/
  download_onClick(type: string) {
    this.menuActionChange.emit({ type: "Download", data: type });
  }

  print_onClick(menu) {
    menu._overlayRef._host.parentElement.click();
    this.menuActionChange.emit({ type: "Print", data: null });
  }
}

export interface TableMenuActionChange {
  type:
    | "FilterClear"
    | "TableSetting"
    | "Download"
    | "SaveSetting"
    | "DeleteSetting"
    | "SelectSetting"
    | "DefaultSetting"
    | "Print"
    | "FullScreenMode";
  data?: any;
}
