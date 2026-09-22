import { DatasetTableComponent } from "./dataset-table.component";
import { TableSettingsStorageService } from "shared/services/table-settings-storage.service";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  setTableColumnsAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { TableSettingEventType } from "shared/modules/dynamic-material-table/models/table-setting.model";

describe("DatasetTableComponent (storage interactions)", () => {
  let component: DatasetTableComponent;
  let storageSpy: jasmine.SpyObj<TableSettingsStorageService>;
  let storeSpy: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj("TableSettingsStorageService", [
      "set",
      "remove",
      "get",
    ]);
    storeSpy = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    // minimal stubs for dependencies used in constructor
    const appConfigService: any = {
      getConfig: () => ({
        datasetPageSizeOptions: [5, 10, 25],
        defaultDatasetsListSettings: {
          columns: [{ name: "pid", order: 0, type: "standard", enabled: true }],
        },
      }),
    };
    const route: any = { snapshot: { queryParams: {} } };
    const tableConfigService: any = {};
    const datasetsListService: any = {
      convertSavedDatasetColumns: (c: any) => c,
    };
    const router: any = { navigate: () => {} };

    // store.select used in component - return observables
    storeSpy.select.and.returnValue(of(undefined));

    component = new DatasetTableComponent(
      appConfigService,
      storeSpy as any,
      route,
      tableConfigService,
      datasetsListService,
      router,
      storageSpy,
    );
  });

  it("saveTableSettings should call storage.set and dispatch updateUserSettingsAction", () => {
    const setting: any = {
      columnSetting: [{ name: "pid", display: "visible" }],
    };

    component.saveTableSettings(setting as any);

    expect(storageSpy.set).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      updateUserSettingsAction({
        property: { fe_dataset_table_columns: jasmine.anything() as any },
      }),
    );
  });

  it("saveTableSettings should dispatch setTableColumnsAction to update the store synchronously", () => {
    const setting: any = {
      columnSetting: [{ name: "pid", display: "visible" }],
    };

    component.saveTableSettings(setting as any);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      setTableColumnsAction({
        columns: jasmine.anything() as any,
        scope: "dataset",
      }),
    );
  });

  it("onSettingChange with apply should persist the setting", () => {
    const setting: any = {
      columnSetting: [{ name: "pid", display: "hidden", enabled: false }],
    };

    component.onSettingChange({
      type: TableSettingEventType.apply,
      setting,
    });

    expect(storageSpy.set).toHaveBeenCalled();

    const dispatches = storeSpy.dispatch.calls
      .allArgs()
      .map(([action]) => action);
    expect(
      dispatches.some((a: any) => a.type === setTableColumnsAction.type),
    ).toBe(true);
    expect(
      dispatches.some((a: any) => a.type === updateUserSettingsAction.type),
    ).toBe(true);
  });

  it("resolveColumnSource should prefer persisted columns over store columns when storage has entries", () => {
    const persistedColumns: any = [
      { name: "runNumber", enabled: false, order: 4 },
    ];
    storageSpy.get.and.returnValue(persistedColumns);
    component.currentUserId = "user-1";

    const result = component.resolveColumnSource([
      { name: "runNumber", enabled: true, order: 4 },
    ] as any);

    expect(storageSpy.get).toHaveBeenCalledWith("datasetsTable", "user-1");
    expect(result).toEqual(persistedColumns);
  });

  it("resolveColumnSource should fall back to store columns when storage has no entries", () => {
    storageSpy.get.and.returnValue(undefined);
    component.currentUserId = "user-1";

    const storeColumns = [{ name: "pid", enabled: true, order: 0 }] as any;

    const result = component.resolveColumnSource(storeColumns);

    expect(result).toBe(storeColumns);
  });

  it("onSettingChange with reset should remove stored key and dispatch setTableColumnsAction with defaults", () => {
    component.onSettingChange({
      type: TableSettingEventType.reset,
      setting: { columnSetting: [] } as any,
    });

    expect(storageSpy.remove).toHaveBeenCalled();

    const dispatches = storeSpy.dispatch.calls
      .allArgs()
      .map(([action]) => action);
    expect(
      dispatches.some((a: any) => a.type === updateUserSettingsAction.type),
    ).toBe(true);
    expect(
      dispatches.some((a: any) => a.type === setTableColumnsAction.type),
    ).toBe(true);

    const setColumns = dispatches.find(
      (a: any) => a.type === setTableColumnsAction.type,
    ) as any;
    expect(setColumns.scope).toBe("dataset");
    expect(setColumns.columns).toEqual([
      { name: "pid", order: 0, type: "standard", enabled: true },
    ]);
  });
});
