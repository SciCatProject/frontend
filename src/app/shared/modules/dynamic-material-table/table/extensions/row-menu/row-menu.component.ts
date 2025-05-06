import {
  ChangeDetectionStrategy,
  Component,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { isNullorUndefined } from "../../../cores/type";
import { ContextMenuItem } from "../../../models/context-menu.model";
import { TableSetting } from "../../../models/table-setting.model";

@Component({
  selector: "row-menu",
  templateUrl: "./row-menu.component.html",
  styleUrls: ["./row-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RowMenuComponent<T> {
  @Output() rowActionChange: EventEmitter<ContextMenuItem> =
    new EventEmitter<ContextMenuItem>();
  @Input() actionMenus: ContextMenuItem[] = [];
  @Input() tableSetting: TableSetting;
  @Input() rowActionMenu?: { [key: string]: ContextMenuItem };
  visibleActionMenus: ContextMenuItem[] = [];

  constructor() {}

  menuOnClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.visibleActionMenus = [];
    this.actionMenus.forEach((menu) => {
      const am: ContextMenuItem =
        isNullorUndefined(this.rowActionMenu) ||
        isNullorUndefined(this.rowActionMenu[menu.name])
          ? menu
          : this.rowActionMenu[menu.name];
      if (isNullorUndefined(am.visible) || am.visible) {
        this.visibleActionMenus.push({
          name: menu.name,
          text: am.text || menu.text,
          disabled: am.disabled || menu.disabled,
          icon: am.icon || menu.icon,
          color: am.color || menu.color,
        });
      }
    });
  }

  menuButton_OnClick(menu: ContextMenuItem) {
    this.rowActionChange.emit(menu);
  }
}
