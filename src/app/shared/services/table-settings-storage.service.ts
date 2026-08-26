import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface StoredTableColumns {
  version: string; // e.g. "v1"
  columns: unknown[]; // the columnsSetting payload
  savedAt?: string;
  userId?: string;
}

@Injectable({ providedIn: "root" })
export class TableSettingsStorageService {
  private readonly keyPrefix = "scicat.table";
  private readonly version = "v1";
  private readonly change$ = new Subject<{ tableName: string; userId?: string }>();

  // Public observable consumers can subscribe to be notified when other tabs or
  // the same tab make changes via this service
  public readonly changes$: Observable<{ tableName: string; userId?: string }> = this.change$.asObservable();

  constructor() {
    this.initCrossTabSync();
    // Attempt migration from legacy sessionStorage keys on startup (best-effort)
    this.migrateLegacyKeys();
  }

  private keyFor(tableName: string, userId?: string) {
    return `${this.keyPrefix}.${userId || "anon"}.${tableName}.columns.${this.version}`;
  }

  get(tableName: string, userId?: string): StoredTableColumns["columns"] | undefined {
    try {
      const raw = localStorage.getItem(this.keyFor(tableName, userId));
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as StoredTableColumns;
      if (!parsed || !parsed.columns) return undefined;
      return parsed.columns;
    } catch (e) {
      // Parsing or access error — return undefined to let callers fall back
      return undefined;
    }
  }

  set(tableName: string, columns: unknown[], userId?: string) {
    try {
      const payload: StoredTableColumns = {
        version: this.version,
        columns,
        savedAt: new Date().toISOString(),
        userId,
      };
      localStorage.setItem(this.keyFor(tableName, userId), JSON.stringify(payload));

      // notify same-tab subscribers
      this.change$.next({ tableName, userId });
      // other tabs will receive a 'storage' event automatically
    } catch (e) {
      // swallow storage errors (private mode, quota)
    }
  }

  remove(tableName: string, userId?: string) {
    try {
      localStorage.removeItem(this.keyFor(tableName, userId));
      this.change$.next({ tableName, userId });
    } catch (e) {
      // ignore
    }
  }

  private initCrossTabSync() {
    // Listen to storage events from other tabs/windows
    window.addEventListener("storage", (ev: StorageEvent) => {
      try {
        if (!ev.key) return;
        // Only react to keys that match our prefix and version
        if (!ev.key.startsWith(this.keyPrefix) || !ev.key.endsWith(this.version)) {
          return;
        }

        // parse key format: scicat.table.{userId}.{tableName}.columns.v1
        const parts = ev.key.split(".");
        // expected: [scicat, table, userId, tableName, columns, v1]
        if (parts.length < 6) {
          return;
        }
        const userId = parts[2];
        const tableName = parts[3];
        this.change$.next({ tableName, userId: userId === "anon" ? undefined : userId });
      } catch {
        // ignore malformed keys/events
      }
    });

    // Optionally initialize a BroadcastChannel for lower-latency messaging in supported browsers
    try {
      const bc = new (window as any).BroadcastChannel?.("scicat.table.settings.v1");
      if (bc) {
        bc.onmessage = (msg: any) => {
          const { tableName, userId } = msg.data || {};
          if (tableName) {
            this.change$.next({ tableName, userId });
          }
        };
      }
    } catch {
      // BroadcastChannel not supported or blocked; storage event is sufficient
    }
  }

  private migrateLegacyKeys() {
    // Some code paths in the codebase previously used simple keys like `${tableName}-columns` or sessionStorage.
    // For backward compatibility, attempt to find such entries and migrate them into the new per-user localStorage key.
    try {
      // Iterate over possible legacy key patterns in sessionStorage/localStorage
      // Legacy key: `${tableName}-columns` in local/session storage — we'll search sessionStorage first.
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key) continue;
        if (key.endsWith("-columns")) {
          const tableName = key.replace(/-columns$/, "");
          const raw = sessionStorage.getItem(key);
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              // write to new localStorage as anon user
              const payload: StoredTableColumns = {
                version: this.version,
                columns: parsed,
                savedAt: new Date().toISOString(),
              };
              localStorage.setItem(this.keyFor(tableName), JSON.stringify(payload));
              // remove legacy key to avoid double-migration
              sessionStorage.removeItem(key);
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      // Also check localStorage legacy keys (less likely), but be conservative and only migrate simple arrays
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.endsWith("-columns") && !key.startsWith(this.keyPrefix)) {
          const tableName = key.replace(/-columns$/, "");
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const payload: StoredTableColumns = {
                version: this.version,
                columns: parsed,
                savedAt: new Date().toISOString(),
              };
              localStorage.setItem(this.keyFor(tableName), JSON.stringify(payload));
              localStorage.removeItem(key);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore storage iteration errors
    }
  }
}
