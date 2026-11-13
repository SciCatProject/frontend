import { TestBed } from "@angular/core/testing";
import { TableSettingsStorageService } from "./table-settings-storage.service";

describe("TableSettingsStorageService", () => {
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
    } catch (e) {
      // ignore storage access errors in test environment
    }
  });

  it("should set and get columns correctly", () => {
    const tableName = "datasetsTable";
    const columns = [{ name: "pid", enabled: true }];

    service.set(tableName, columns as any);

    const recovered = service.get(tableName);
    expect(recovered).toBeTruthy();
    expect(Array.isArray(recovered)).toBeTrue();
    expect((recovered as any)[0].name).toBe("pid");
  });

  it("should remove columns", () => {
    const tableName = "datasetsTable";
    const columns = [{ name: "pid", enabled: true }];

    service.set(tableName, columns as any);
    expect(service.get(tableName)).toBeTruthy();

    service.remove(tableName);
    expect(service.get(tableName)).toBeUndefined();
  });

  it("get returns undefined for non-existent key", () => {
    expect(service.get("nonexistent")).toBeUndefined();
  });

  it("emits a local change when set is called", () => {
    const events: any[] = [];
    const sub = service.changes$.subscribe((e) => events.push(e));

    service.set("datasetsTable", [{ name: "pid", enabled: true }] as any);

    sub.unsubscribe();
    expect(
      events.some(
        (e) => e.tableName === "datasetsTable" && e.origin === "local",
      ),
    ).toBeTrue();
  });

  it("emits a remote change for storage events from other tabs", () => {
    const events: any[] = [];
    const sub = service.changes$.subscribe((evt) => events.push(evt));

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "scicat.table.anon.datasetsTable.columns.v1",
      }),
    );

    sub.unsubscribe();
    expect(
      events.some(
        (evt) =>
          evt.tableName === "datasetsTable" &&
          evt.origin === "remote" &&
          evt.userId === undefined,
      ),
    ).toBeTrue();
  });
});
