import { create } from "react-test-renderer";
import BottomNav from "../BottomNav.js";
import React from "react";
import { BrowserRouter } from "react-router-dom";

describe("Bottom Nav component", () => {
  it("should render default bottomNav component", () => {
    const tree = create(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    expect(tree).toMatchSnapshot();
  });
  it("should render default bottomNav component when visible and user belongs to circle", () => {
    const tree = create(
      <BrowserRouter>
        <BottomNav show={true} belongsToCircle={true} />
      </BrowserRouter>
    );

    expect(tree).toMatchSnapshot();
  });
  it("should render default bottomNav component when show is false", () => {
    const tree = create(
      <BrowserRouter>
        <BottomNav show={false} />
      </BrowserRouter>
    );

    expect(tree).toMatchSnapshot();
  });
});
