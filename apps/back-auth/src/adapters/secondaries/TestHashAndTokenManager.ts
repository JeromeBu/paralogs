import { WithUserUuid } from "@paralogs/auth/interface";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { HashAndTokenManager } from "../../domain/writes/gateways/HashAndTokenManager";
import { Password } from "../../domain/writes/valueObjects/user/Password";

// the number passed in bcrypt.hash is the number of salt loops.
// The bigger it is the longest the request will be (12 => 300 to 400 ms)

export class TestHashAndTokenManager implements HashAndTokenManager {
  private token: string | null = null;

  public generateToken(params: WithUserUuid) {
    return this.token ?? jwt.sign(params, "TODO: change Secret");
  }

  public hash(password: Password) {
    return bcrypt.hash(password.value, 1);
  }

  public compareHashes(candidatePassword: string, userPasswordHash: string) {
    return bcrypt.compare(candidatePassword, userPasswordHash);
  }

  public setGeneratedToken(nextToken: string) {
    this.token = nextToken;
  }
}
