import * as Yup from "yup";

import { Flavor } from "@paralogs/shared/common";

export type UserUuid = Flavor<string, "UserUuid">;

export interface WithUserUuid {
  userUuid: UserUuid;
}

export interface WithUuid {
  uuid: UserUuid;
}

export interface WithPassword {
  password: string;
}

export interface WithEmail {
  email: string;
}

export interface WithOtherInformation {
  firstName: string;
  lastName?: string;
}

export type UserDTO = WithUuid & WithEmail & WithOtherInformation;

export type CurrentUserWithAuthToken = {
  currentUser: UserDTO;
  token: string;
};

export type LoginParams = WithEmail & WithPassword;
export const loginSchema = Yup.object().shape<LoginParams>({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export type SignUpParams = WithEmail & WithPassword & WithOtherInformation;
export const signUpSchema = Yup.object().shape<SignUpParams>({
  email: Yup.string().email().required(),
  password: Yup.string().required().min(8),
  firstName: Yup.string().required(),
  lastName: Yup.string(),
});

export type UpdateUserDTO = Partial<WithOtherInformation>;
export const updateUserSchema = Yup.object().shape<UpdateUserDTO>({
  firstName: Yup.string(),
  lastName: Yup.string(),
});
