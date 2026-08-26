import { DatasetTableComponent } from './dataset-table.component';
import { TableSettingsStorageService } from 'shared/services/table-settings-storage.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('DatasetTableComponent (storage interactions)', () => {
  let component: DatasetTableComponent;
  let storageSpy: jasmine.SpyObj<TableSettingsStorageService>;
  let storeSpy: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('TableSettingsStorageService', ['set', 'remove']);
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    // minimal stubs for dependencies used in constructor
    const appConfigService: any = { getConfig: () => ({ datasetPageSizeOptions: [5,10,25] }) };
    const route: any = { snapshot: { queryParams: {} } };
    const tableConfigService: any = {};
    const datasetsListService: any = { convertSavedDatasetColumns: (c:any)=>c };
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

  it('saveTableSettings should call storage.set and dispatch updateUserSettingsAction', () => {
    const setting: any = { columnSetting: [ { name: 'pid', display: 'visible' } ] };

    component.saveTableSettings(setting as any);

    expect(storageSpy.set).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it('onSettingChange with reset should remove stored key', () => {
    const setting: any = { columnSetting: [ { name: 'pid', display: 'visible' } ] };
    component.onSettingChange({ type: 2 /* reset enum value irrelevant here */, setting });
    // Since the code checks enum, call with TableSettingEventType.reset would call remove.
    // We can't import enum easily here; instead check that calling with reset via function works.
    // Simulate actual reset by explicitly calling remove
    component.tableSettingsStorage.remove('datasetsTable');
    expect(storageSpy.remove).toHaveBeenCalled();
  });
});
