import { Injectable } from "@angular/core";

type RestoreHandler<T> = (value: T) => void;
type SnapshotHandler<T> = () => T;

@Injectable({ providedIn: "root" })
export class PersistenceService {
  private static readonly MAX_IDLE_MS = 1 * 60 * 1000;
  private readonly isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
  private readonly entries: Array<{ key: string; snapshot: SnapshotHandler<unknown> }> = [];
  private listenerRegistered = false;

  register<T>(key: string, snapshot: SnapshotHandler<T>, restore: RestoreHandler<unknown>): void {
    if (!this.isBrowser) {
      return;
    }

    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        restore(parsed);
      } catch {
        // ignore corrupted cache
      }

      localStorage.removeItem(key);
    }

    this.entries.push({ key, snapshot: snapshot as SnapshotHandler<unknown> });
    this.ensureListener();
  }

  private ensureListener(): void {
    if (this.listenerRegistered || !this.isBrowser) {
      return;
    }

    this.listenerRegistered = true;

    window.addEventListener("beforeunload", () => {
      const snapshots: Array<{ key: string; data: unknown }> = [];
      for (const entry of this.entries) {
        try {
          snapshots.push({ key: entry.key, data: entry.snapshot() });
        } catch {
          return;
        }
      }

      // Grab from all stores the latest in time store change
      const latestStoreChange = this.getLatestStoreChange(snapshots.map((item) => item.data));

      if (!this.shouldPersist({ latestStoreChange })) return;

      for (const snapshot of snapshots) {
        try {
          localStorage.setItem(snapshot.key, JSON.stringify(snapshot.data));
        } catch {
          // ignore serialization issues
        }
      }
    });
  }

  private shouldPersist(value: unknown): boolean {
    if (!value || typeof value !== "object") return false;

    const lastChange = (value as { latestStoreChange?: unknown }).latestStoreChange;
    if (typeof lastChange !== "number") return false;

    return Date.now() - lastChange <= PersistenceService.MAX_IDLE_MS;
  }

  private getLatestStoreChange(values: unknown[]): number | null {
    let latest: number | null = null;
    for (const value of values) {
      if (!value || typeof value !== "object") {
        continue;
      }
      const lastChange = (value as { latestStoreChange?: unknown }).latestStoreChange;
      if (typeof lastChange !== "number") {
        continue;
      }
      if (latest === null || lastChange > latest) {
        latest = lastChange;
      }
    }
    return latest;
  }
}
