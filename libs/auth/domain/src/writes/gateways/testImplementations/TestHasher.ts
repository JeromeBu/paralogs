import * as bcrypt from "bcryptjs";
import { Hasher } from "../Hasher";

// the number passed in bcrypt.hash is the number of salt loops.
// The bigger it is the longest the request will be (12 => 300 to 400 ms)

export class TestHasher implements Hasher {
  public hash(password: string) {
    return bcrypt.hash(password, 1);
  }

  public compare(candidatePassword: string, userPasswordHash: string) {
    return bcrypt.compare(candidatePassword, userPasswordHash);
  }
}
