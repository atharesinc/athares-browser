import { insertBreaks } from "../transform";
import { insertBreaksMultiInput, insertBreaksMultiOutput } from "./data";

describe("insertBreaks", () => {
  it("should render nothing for an empty array", () => {
    const input = [];

    const output = insertBreaks(input);

    expect(output).toEqual([]);
  });

  it("should appropriately add break objects for multi-day message arrays", () => {
    const input = insertBreaksMultiInput;

    const output = insertBreaks(input);

    expect(output).toEqual(insertBreaksMultiOutput);
  });
});
