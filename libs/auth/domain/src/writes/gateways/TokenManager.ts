import { WithUserUuid } from "@paralogs/auth/interface";

export interface TokenManager {
  generateToken: (params: WithUserUuid) => string;
}
