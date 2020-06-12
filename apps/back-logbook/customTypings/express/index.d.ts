declare namespace Express {
  import { UserUuid } from "@paralogs/shared";

  export interface Request {
    currentUserUuid: UserUuid;
  }
}
