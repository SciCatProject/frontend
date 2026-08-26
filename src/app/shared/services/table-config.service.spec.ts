import { TestBed } from '@angular/core/testing';
import { TableConfigService } from './table-config.service';
import { TableSettingsStorageService } from './table-settings-storage.service';
import { ITableSetting } from '../modules/dynamic-material-table/models/table-setting.model';

describe('TableConfigService (fallback)', () => {
  let service: TableConfigService;
  let storage: jasmine.SpyObj<TableSettingsStorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('TableSettingsStorageService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        TableConfigService,
        { provide: TableSettingsStorageService, useValue: storageSpy },
      ],
    });

    service = TestBed.inject(TableConfigService);
    storage = TestBed.inject(TableSettingsStorageService) as jasmine.SpyObj<TableSettingsStorageService>;
  });

  it('should use recovered savedTableConfig from storage when none provided', () => {
    const tableName = 'datasetsTable';

    const savedColumns = [
      { name: 'pid', enabled: true, order: 0 },
    ];

    storage.get.and.returnValue(savedColumns as any);

    const defaultSetting: ITableSetting = {
      settingList: [
        { columnSetting: [{ name: 'PID' }], isDefaultSetting: true, isCurrentSetting: true }
      ],
      rowStyle: {}
    } as any;

    const config = service.getTableSettingsConfig(tableName, defaultSetting, undefined);

    expect(config).toBeTruthy();
    // find added setting by settingName
    const found = config.settingList.find(s => (s as any).settingName === tableName);
    expect(found).toBeTruthy();
    // merged columnSetting should include our savedColumns (mapped)
    expect((found as any).columnSetting).toBeTruthy();
  });
});
