import {
  CurrentUserWithAuthToken,
  LoginParams,
  SignUpParams,
  UpdateUserDTO,
  UserDTO,
} from "@paralogs/shared";
import { Observable } from "rxjs";

export interface AuthGateway {
  login(params: LoginParams): Observable<CurrentUserWithAuthToken>;
  signUp(params: SignUpParams): Observable<CurrentUserWithAuthToken>;
  getCurrentUser(): Observable<CurrentUserWithAuthToken>;
  updateUser(params: UpdateUserDTO): Observable<UserDTO>;
}
