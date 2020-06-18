import { UserUuid } from "@paralogs/auth/interface";
import { Persisted } from "@paralogs/back/shared";

export type UserPersistence = {
  id?: number;
  uuid: UserUuid;
  email: string;
  first_name: string;
  last_name?: string;
  hashed_password: string;
  auth_token: string;
};

export type UserPersisted = Persisted<UserPersistence>;

// Question : comment assurer qu'on a bien toutes les clés dans necessaire dans PilotPersistence au niveau du typage ?
// les clés doivent avoir une correspondance avec les key de UserEntityProps dans UserEntity
