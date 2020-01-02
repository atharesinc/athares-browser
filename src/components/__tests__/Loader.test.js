import { create } from "react-test-renderer";
import Loader from "../Loader.js";
import React from "react";

describe("Loader component", () => {
  it("should render loader component", () => {
    const tree = create(<Loader />);

    expect(tree).toMatchSnapshot();
  });
});
