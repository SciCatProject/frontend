import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { TablePagination } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  TableSetting,
  VisibleActionMenu,
} from "shared/modules/dynamic-material-table/models/table-setting.model";

export const tableColumnsConfig: TableField<any>[] = [
  {
    name: "row",
    type: "number",
  },
  {
    name: "order",
    header: "Row Order",
    sticky: "start",
    option: 1,
    clickable: false,
    rowSelectable: false,
  },
  {
    name: "name",
    header: "Element Name",
    sticky: "start",
  },
  { name: "weight" },
  { name: "color" },
  { name: "brand" },
  {
    name: "setting",
    icon: "chrome_reader_mode",
    iconColor: "white",
    option: 2,
    clickable: false,
    rowSelectable: false,
  },
];

const actionMenu: VisibleActionMenu = {
  json: true,
  csv: true,
  print: true,
  columnSettingPin: true,
  columnSettingFilter: true,
  clearFilter: true,
};

export const tableSettingsConfig: TableSetting = {
  direction: "ltr",
  visibleActionMenu: actionMenu,
  autoHeight: true,
  saveSettingMode: "multi",
};

export const paginationConfig: TablePagination = {
  length: 100,
  pageIndex: 0,
  pageSize: 10,
  pageSizeOptions: [5, 10, 15, 20],
  showFirstLastButtons: true,
};
