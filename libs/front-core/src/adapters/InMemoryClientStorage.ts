import { of } from "rxjs";

import { ClientStorage } from "../useCases/auth/gateways/ClientStorage";

export class InMemoryClientStorage implements ClientStorage {
  public async set(key: string, value: string) {
    this._localStore[key] = value;
  }

  public get(key: string): string | null {
    return this._localStore[key] ?? null;
  }

  public remove(key: string) {
    delete this._localStore[key];
    return of(undefined);
  }

  private _localStore: { [key: string]: string } = {};
}
