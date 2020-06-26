import { WithUserUuid } from "@paralogs/auth/interface";
import * as jwt from "jsonwebtoken";

import { TokenManager } from "../TokenManager";

export class TestTokenManager implements TokenManager {
  private token: string | null = null;

  public generateToken(params: WithUserUuid) {
    return this.token ?? jwt.sign(params, "TODO: change Secret");
  }

  public setGeneratedToken(nextToken: string) {
    this.token = nextToken;
  }
}
