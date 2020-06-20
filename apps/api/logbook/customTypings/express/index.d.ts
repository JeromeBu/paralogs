declare namespace Express {
  import { UserUuid } from "@paralogs/shared/common";

  export interface Request {
    currentUserUuid: UserUuid;
  }
}
