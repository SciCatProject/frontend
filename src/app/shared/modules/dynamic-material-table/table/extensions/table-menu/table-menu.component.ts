import {
  ChangeDetectionStrategy,
  Component,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
import { TableService } from "../../dynamic-mat-table.service";
import { ITableSetting } from "../../../models/table-setting.model";
import { deepClone, isNullorUndefined } from "../../../cores/type";
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
export class TableMenuComponent {
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

  @Output() tableSettingChange = new EventEmitter<ITableSetting>();

  currentColumn: number = null;
  reverseDirection: "auto" | Direction = "auto";
  originalTableSetting: ITableSetting;
  currentTableSetting: ITableSetting;

  constructor(public tableService: TableService) {}

  screenMode_onClick() {
    this.menuActionChange.emit({
      type: TableMenuAction.FullScreenMode,
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
      type: TableMenuAction.TableSetting,
      data: this.currentTableSetting,
    });
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
