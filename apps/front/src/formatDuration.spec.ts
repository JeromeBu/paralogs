import { formatDuration } from "./formatDuration";

describe("Duration formatter", () => {
  it("return expected formats", () => {
    expectCorrectFormat(12, "12 min");
    expectCorrectFormat(25, "25 min");
    expectCorrectFormat(67, "1h07");
    expectCorrectFormat(120, "2h00");
    expectCorrectFormat(345, "5h45");
  });
  const expectCorrectFormat = (minutesInput: number, expectedResult: string) =>
    expect(formatDuration(minutesInput)).toEqual(expectedResult);
});
