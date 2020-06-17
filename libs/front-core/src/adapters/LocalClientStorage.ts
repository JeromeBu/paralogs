import { of } from "rxjs";

import { ClientStorage } from "../useCases/auth/gateways/ClientStorage";

export class LocalClientStorage implements ClientStorage {
  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public remove(key: string) {
    return of(localStorage.removeItem(key));
  }
}
