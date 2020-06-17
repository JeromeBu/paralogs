import {
  CurrentUserWithAuthToken,
  LoginParams,
  SignUpParams,
  UpdateUserDTO,
  UserDTO,
} from "@paralogs/auth/interface";
import * as R from "ramda";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { AuthGateway } from "../useCases/auth/gateways/AuthGateway";

const excludeNilValues = R.compose(R.not, R.isNil);

export class InMemoryAuthGateway implements AuthGateway {
  private _currentUserWithToken$ = new BehaviorSubject<
    CurrentUserWithAuthToken
  >((undefined as unknown) as CurrentUserWithAuthToken);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public login(params: LoginParams) {
    return this._currentUserWithTokenExceptNil();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public signUp(params: SignUpParams) {
    return this._currentUserWithTokenExceptNil();
  }

  public getCurrentUser() {
    return this._currentUserWithTokenExceptNil();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateUser(params: UpdateUserDTO): Observable<UserDTO> {
    return this._currentUserWithTokenExceptNil().pipe(
      map(R.prop("currentUser")),
    );
  }

  get currentUserWithToken$() {
    return this._currentUserWithToken$;
  }

  private _currentUserWithTokenExceptNil(): Observable<
    CurrentUserWithAuthToken
  > {
    return this._currentUserWithToken$.pipe(filter(excludeNilValues));
  }
}
