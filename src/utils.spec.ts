import { createURL, pathToSearchState } from "./utils";

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
