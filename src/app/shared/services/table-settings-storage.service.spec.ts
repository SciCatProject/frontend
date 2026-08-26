import { TestBed } from '@angular/core/testing';
import { TableSettingsStorageService } from './table-settings-storage.service';

describe('TableSettingsStorageService', () => {
  let service: TableSettingsStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableSettingsStorageService],
    });
    service = TestBed.inject(TableSettingsStorageService);
    // clear relevant localStorage keys before each test
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
  });

  it('should set and get columns correctly', () => {
    const tableName = 'datasetsTable';
    const columns = [{ name: 'pid', enabled: true }];

    service.set(tableName, columns as any);

    const recovered = service.get(tableName);
    expect(recovered).toBeTruthy();
    expect(Array.isArray(recovered)).toBeTrue();
    expect((recovered as any)[0].name).toBe('pid');
  });

  it('should remove columns', () => {
    const tableName = 'datasetsTable';
    const columns = [{ name: 'pid', enabled: true }];

    service.set(tableName, columns as any);
    expect(service.get(tableName)).toBeTruthy();

    service.remove(tableName);
    expect(service.get(tableName)).toBeUndefined();
  });

  it('get returns undefined for non-existent key', () => {
    expect(service.get('nonexistent')).toBeUndefined();
  });
});
