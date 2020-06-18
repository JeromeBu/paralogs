import { WithUserUuid } from "@paralogs/auth/interface";

import { Password } from "../valueObjects/Password";

export interface HashAndTokenManager {
  generateToken: (params: WithUserUuid) => string;
  hash: (password: Password) => Promise<string>;
  compareHashes: (
    candidatePassword: string,
    userPasswordHash: string,
  ) => Promise<boolean>;
}
