import {
  Either,
  EitherAsync,
  Just,
  Left,
  Maybe,
  Nothing,
  Right,
} from "purify-ts";
import {
  forEither,
  forEitherAsync,
  forMaybe,
  forMaybeAsync,
  JustAsync,
  LeftAsync,
  NothingAsync,
  RightAsync,
} from "./purifyAdds";

describe("forMaybe", () => {
  it("Gets the value inside maybe", (done) => {
    forMaybe(function* (chain) {
      const a = yield* chain(Just("a"));
      expect(a).toBe("a");
      done();
    });
  });

  it("Sends back the returned value wrap in a Maybe", () => {
    const maybeMyNum = forMaybe(function* (chain) {
      const myStr = yield* chain(Just("abc"));
      expect(myStr).toBe("abc");

      const myNum = yield* chain(Just(12));
      expect(myNum).toBe(12);

      return myStr.length < myNum;
    });
    expect(maybeMyNum.extract()).toBe(true);
  });

  it("Sends back Nothing if one value was Nothing", () => {
    const maybeMyStr = forMaybe(function* (chain) {
      const maybeStr: Maybe<string> = Nothing;

      const myStr = yield* chain(maybeStr);
      const myNum = yield* chain(Just(10));

      return myStr.length < myNum;
    });
    expect(maybeMyStr.isNothing()).toBe(true);
  });
});

describe("forMaybeAsync", () => {
  it("Gets the value inside maybeAsync, and sends back the return", async () => {
    const maybe = await forMaybeAsync(function* (chain) {
      const a = yield* chain(JustAsync("aa"));
      expect(a).toBe("aa");

      const b = yield* chain(JustAsync("bb"));
      expect(b).toBe("bb");

      return a.length + b.length;
    }).run();

    expect(maybe.extract()).toBe(4);
  });

  it("Sends back Nothing if one value was Nothing", async () => {
    const maybeMyStr = await forMaybeAsync(function* (chain) {
      const maybeAsyncStr = NothingAsync<string>();

      const myStr = yield* chain(maybeAsyncStr);
      const myNum = yield* chain(JustAsync(10));

      return myStr.length < myNum;
    }).run();
    expect(maybeMyStr.isNothing()).toBe(true);
  });
});

describe("forEither", () => {
  it("Gets the 'Right' value inside either", (done) => {
    forEither(function* (chain) {
      const a = yield* chain(Right("a"));
      expect(a).toBe("a");
      done();
    });
  });

  it("Sends back the returned value wrap in an Either", () => {
    const eitherIsToShort = forEither(function* (chain) {
      const myStr = yield* chain(Right("abc"));
      expect(myStr).toBe("abc");

      const myNum = yield* chain(Right(12));
      expect(myNum).toBe(12);

      return myStr.length < myNum;
    });
    expect(eitherIsToShort.extract()).toBe(true);
  });

  it("Sends back Left if one value was Left", () => {
    const eitherIsToShort = forEither(function* (chain) {
      const eitherNum: Either<string, number> = Left("Failed");
      const myStr = yield* chain(Right("my string"));
      const myNum = yield* chain(eitherNum);

      return myStr.length < myNum;
    });
    expect(eitherIsToShort.isLeft()).toBe(true);
    eitherIsToShort.mapLeft((value) => expect(value).toBe("Failed"));
  });
});

describe("forEitherAsync", () => {
  it("Gets the 'RightAsync' value inside eitherAsync", async () => {
    const eitherA = await forEitherAsync(function* (chain) {
      const a = yield* chain(RightAsync("aa"));
      expect(a).toBe("aa");

      const b = yield* chain(RightAsync("bb"));
      expect(b).toBe("bb");

      return a.length + b.length;
    }).run();

    expect(eitherA.extract()).toBe(4);
  });

  it("Sends back LeftAsync if one value was LeftAsync", async () => {
    const eitherIsToShort = await forEitherAsync(function* (chain) {
      const eitherAsyncNum: EitherAsync<string, number> = LeftAsync("Failed");
      const myStr = yield* chain(RightAsync("my string"));
      const myNum = yield* chain(eitherAsyncNum);

      return myStr.length < myNum;
    }).run();
    expect(eitherIsToShort.isLeft()).toBe(true);
    eitherIsToShort.mapLeft((value) => expect(value).toBe("Failed"));
  });
});
