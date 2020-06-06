import { WithUserUuid } from "@paralogs/shared";

import { Password } from "../valueObjects/user/Password";

export interface HashAndTokenManager {
  generateToken: (params: WithUserUuid) => string;
  hash: (password: Password) => Promise<string>;
  compareHashes: (
    candidatePassword: string,
    userPasswordHash: string,
  ) => Promise<boolean>;
}
