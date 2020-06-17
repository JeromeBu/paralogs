import { Observable } from "rxjs";

export interface ClientStorage {
  set: (key: string, value: string) => void;
  get: (key: string) => string | null;
  remove: (key: string) => Observable<void>;
}
