import Router from "next/router";

import { createURL, onSearchStateChange, pathToSearchState } from "./utils";

jest.mock("next/router");

describe("createURL", () => {
  it("should return url as expected", () => {
    const searchState = {
      configure: {
        hitsPerPage: "12",
      },
      page: "1",
      refinementList: {
        categories: ["Appliances"],
      },
    };

    expect(createURL(searchState)).toBe(
      "?configure%5BhitsPerPage%5D=12&page=1&refinementList%5Bcategories%5D%5B0%5D=Appliances"
    );
  });
});

describe("pathToSearchState", () => {
  it("should return search state as expected", () => {
    const searchState = pathToSearchState(
      "/foo/?refinementList%5Bcategories%5D%5B0%5D=Appliances&page=1&configure%5BhitsPerPage%5D=12"
    );

    expect(searchState).toEqual({
      configure: {
        hitsPerPage: "12",
      },
      page: "1",
      refinementList: {
        categories: ["Appliances"],
      },
    });
  });

  it("should return empty search state", () => {
    expect(pathToSearchState("/foo/")).toEqual({});
  });
});

describe("onSearchStateChange", () => {
  it("should call Router.replace with search state in url", () => {
    const searchState = {
      refinementList: {
        categories: ["Appliances"],
      },
    };

    Router.pathname = "/foo/[slug]";
    Router.asPath = "/foo/bar";

    onSearchStateChange(searchState, Router);

    expect(Router.replace).toHaveBeenCalledWith(
      "/foo/[slug]",
      "/foo/bar?refinementList%5Bcategories%5D%5B0%5D=Appliances",
      { shallow: true }
    );
  });

  it("should merge searchState on top of existing query params", () => {
    const searchState = {
      page: "2",
      refinementList: {
        categories: ["Appliances"],
      },
    };

    Router.pathname = "/foo/[slug]";
    Router.asPath =
      "/foo/bar?foo=bar&refinementList%5Bcategories%5D%5B0%5D=Kitcken";

    onSearchStateChange(searchState, Router);

    expect(Router.replace).toHaveBeenCalledWith(
      "/foo/[slug]",
      "/foo/bar?foo=bar&refinementList%5Bcategories%5D%5B0%5D=Kitcken&refinementList%5Bcategories%5D%5B1%5D=Appliances&page=2",
      { shallow: true }
    );
  });
});
