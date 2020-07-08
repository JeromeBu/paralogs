export interface Hasher {
  hash: (password: string) => Promise<string>;
  compare: (
    candidatePassword: string,
    userPasswordHash: string,
  ) => Promise<boolean>;
}
