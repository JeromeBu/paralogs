import { makeUserDTO, SignUpParams, WithUuid } from "@paralogs/auth/interface";
import { combineEithers, PersonName } from "@paralogs/shared/back";
import { generateUuid } from "@paralogs/shared/common";
import { liftEither } from "purify-ts/EitherAsync";
import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";
import { Hasher } from "../gateways/Hasher";
import { InMemoryUserRepo } from "../gateways/testImplementations";
import { UserEntity } from "../entities/UserEntity";
import { TokenManager } from "../gateways/TokenManager";

const validateSignUpParams = (
  { email, firstName, lastName, password }: SignUpParams,
  hasher: Hasher,
) =>
  liftEither(
    combineEithers({
      email: Email.create(email),
      firstName: PersonName.create(firstName),
      lastName: PersonName.create(lastName),
    }),
  ).chain((params) => {
    return Password.create(password, hasher).map((password) => ({
      ...params,
      password,
    }));
  });

interface Dependencies {
  tokenManager: TokenManager;
  hasher: Hasher;
}

export const makeUserEntityCreator = ({
  tokenManager,
  hasher,
}: Dependencies) => async (
  userParams: Partial<SignUpParams & WithUuid & { id: number }> = {},
): Promise<UserEntity> => {
  const { password = "Bépo1234", ...userParamsWithoutPassword } = userParams;
  const userDTO = makeUserDTO(userParamsWithoutPassword);

  return (
    await validateSignUpParams({ ...userDTO, password }, hasher)
      .map((params) =>
        UserEntity.create(
          { ...params, uuid: userParams.uuid ?? generateUuid() },
          { tokenManager },
        ),
      )
      .map((userEntity) => {
        if (userParams.id) userEntity.setIdentity(userParams.id);
        return userEntity;
      })
      .run()
  )
    .ifLeft((error) => {
      throw error;
    })
    .extract() as UserEntity;
};

export type MakeUserEntity = ReturnType<typeof makeUserEntityCreator>;

interface SetupCurrentUserDependencies {
  tokenManager: TokenManager;
  hasher: Hasher;
  userRepo: InMemoryUserRepo;
}

export const setupCurrentUserCreator = ({
  hasher,
  tokenManager,
  userRepo,
}: SetupCurrentUserDependencies) => async (
  userParams?: Partial<SignUpParams>,
) => {
  const makeUserEntity = makeUserEntityCreator({ hasher, tokenManager });
  const currentUserEntity = await makeUserEntity(userParams);
  if (!currentUserEntity.hasIdentity()) currentUserEntity.setIdentity(125);
  userRepo.setUsers([currentUserEntity]);
  return currentUserEntity;
};

export type SetupCurrentUser = ReturnType<typeof setupCurrentUserCreator>;
