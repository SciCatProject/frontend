export interface TableLabels {
  NoData: string;
}

export interface FilterLabels {
  Clear: string;
  Search: string;
  And: string;
  Or: string;
  /* Text Compare */
  Text: string;
  TextContains: string;
  TextEquals: string;
  TextStartsWith: string;
  TextEndsWith: string;
  TextEmpty: string;
  TextNotEmpty: string;
  /* Number Compare */
  Number: string;
  NumberEquals: string;
  NumberNotEquals: string;
  NumberGreaterThan: string;
  NumberLessThan: string;
  NumberEmpty: string;
  NumberNotEmpty: string;
  /* Category List Compare */
  CategoryContains: string;
  CategoryNotContains: string;
  /* Boolean Compare */
  /* Date Compare */

  /* Paginator */
}

export interface MenuLabels {
  saveData: string;
  newSetting: string;
  defaultSetting: string;
  noSetting: string;
  columnSetting: string;
  saveTableSetting: string;
  fullScreen: string;
  clearFilter: string;
  jsonFile: string;
  csvFile: string;
  printTable: string;
  filterMode: string;
  filterLocalMode: string;
  filterServerMode: string;
  sortMode: string;
  sortLocalMode: string;
  sortServerMode: string;
  printMode: string;
  printYesMode: string;
  printNoMode: string;
  pinMode: string;
  pinNoneMode: string;
  pinStartMode: string;
  pinEndMode: string;
  thereIsNoColumn: string;
}
