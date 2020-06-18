import {
  LoginParams,
  SignUpParams,
  UpdateUserDTO,
  UserDTO,
} from "@paralogs/auth/interface";
import { Observable } from "rxjs";

import { AuthGateway } from "../useCases/auth/gateways/AuthGateway";
import { httpClient } from "./libs/httpClient";

export class HttpAuthGateway implements AuthGateway {
  public login(params: LoginParams) {
    return httpClient.login(params);
  }

  public signUp(params: SignUpParams) {
    return httpClient.signUp(params);
  }

  public updateUser(params: UpdateUserDTO): Observable<UserDTO> {
    return httpClient.updateUser()(params);
  }

  public getCurrentUser() {
    return httpClient.getMe()();
  }
}
