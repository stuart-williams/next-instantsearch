const mockFindResultsState = jest.fn().mockResolvedValue("some results");

jest.mock("react-instantsearch-dom/server", () => ({
  findResultsState: mockFindResultsState,
}));

import algoliasearch from "algoliasearch/lite";
import { mount } from "enzyme";
import { NextComponentType, NextPageContext } from "next";
import React from "react";
import { InstantSearch } from "react-instantsearch-dom";

import { createURL } from "./utils";
import withInstantSearch from "./with-instantsearch";

describe("withInstantSearch", () => {
  const searchClient = algoliasearch("app_id", "api_key");
  const ctx = {
    asPath: "/?refinementList%5Bcategories%5D%5B0%5D=Appliances&page=1",
  } as NextPageContext;

  let Component: NextComponentType | any;
  let expectedSearchState: any;

  beforeEach(() => {
    jest.clearAllMocks();

    Component = () => null;
    Component.getInitialProps = jest.fn().mockResolvedValue({});

    expectedSearchState = {
      refinementList: {
        categories: ["Appliances"],
      },
      page: "1",
    };
  });

  it("should call Component.getInitialProps", async () => {
    const InstantSearchApp = withInstantSearch({ searchClient })(Component);
    await InstantSearchApp.getInitialProps(ctx);

    expect(Component.getInitialProps).toBeCalledWith(ctx);
  });

  it("should use indexName from options", async () => {
    const InstantSearchApp = withInstantSearch({
      indexName: "foo",
      searchClient,
    })(Component);

    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    expect(pageProps.indexName).toBe("foo");
  });

  it("should use indexName from component pageProps", async () => {
    Component.getInitialProps = jest.fn().mockResolvedValue({
      indexName: "bar",
    });

    const InstantSearchApp = withInstantSearch({
      searchClient,
    })(Component);

    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    expect(pageProps.indexName).toBe("bar");
  });

  it("should extract searchState from ctx.asPath", async () => {
    const InstantSearchApp = withInstantSearch({ searchClient })(Component);
    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    expect(pageProps.searchState).toEqual(expectedSearchState);
  });

  it("should merge searchState from component pageProps", async () => {
    expectedSearchState = {
      refinementList: {
        categories: ["Appliances", "TV & Home Theater"],
      },
      page: "1",
    };

    Component.getInitialProps = jest.fn().mockResolvedValue({
      searchState: {
        refinementList: {
          categories: ["TV & Home Theater"],
        },
      },
    });

    const InstantSearchApp = withInstantSearch({ searchClient })(Component);
    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    expect(pageProps.searchState).toEqual(expectedSearchState);
  });

  it("should call options.decorate", async () => {
    Component.getInitialProps = jest.fn().mockResolvedValue({
      foo: "bar",
    });

    const decorate = jest.fn();

    const InstantSearchApp = withInstantSearch({ searchClient, decorate })(
      Component
    );

    await InstantSearchApp.getInitialProps(ctx);

    expect(decorate).toHaveBeenCalledWith({
      ctx,
      Component: InstantSearchApp,
      pageProps: {
        foo: "bar",
      },
    });
  });

  it("should call findResultsState with InstantSearchApp", async () => {
    const InstantSearchApp = withInstantSearch({
      indexName: "foo",
      searchClient,
    })(Component);

    await InstantSearchApp.getInitialProps(ctx);

    expect(mockFindResultsState).toHaveBeenCalledWith(InstantSearchApp, {
      indexName: "foo",
      searchClient,
      searchState: expectedSearchState,
    });
  });

  it("should call findResultsState with DecoratedInstantSearchApp", async () => {
    const InstantSearchApp = withInstantSearch({
      indexName: "foo",
      searchClient,
      decorate: ({ Component: ComponentProp, pageProps }) => (
        <div id="Provider">
          <ComponentProp {...pageProps} />
        </div>
      ),
    })(Component);

    await InstantSearchApp.getInitialProps(ctx);

    const DecoratedInstantSearchApp = mockFindResultsState.mock.calls[0][0];
    const wrapper = mount(<DecoratedInstantSearchApp />);

    expect(wrapper.exists("#Provider")).toEqual(true);
    expect(wrapper.exists(InstantSearchApp)).toEqual(true);
  });

  it("should return expected pageProps", async () => {
    const InstantSearchApp = withInstantSearch({
      indexName: "foo",
      searchClient,
    })(Component);

    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    expect(pageProps).toEqual({
      indexName: "foo",
      resultsState: "some results",
      searchState: expectedSearchState,
    });
  });

  it("should hoist statics", () => {
    Component.foo = "bar";

    const InstantSearchApp = withInstantSearch({ searchClient })(Component);

    expect(InstantSearchApp.foo).toEqual(Component.foo);
  });

  it("should render InstantSearch with correct props", async () => {
    const InstantSearchApp = withInstantSearch({
      indexName: "foo",
      searchClient,
    })(Component);

    const pageProps = await InstantSearchApp.getInitialProps(ctx);

    const wrapper = mount(<InstantSearchApp {...pageProps} />);
    const is = wrapper.find(InstantSearch);

    expect(is.prop("indexName")).toEqual("foo");
    expect(is.prop("searchState")).toEqual(expectedSearchState);
    expect(is.prop("searchClient")).toEqual(searchClient);
    expect(is.prop("createURL")).toEqual(createURL);
    expect(is.prop("onSearchStateChange")).toEqual(expect.any(Function));
  });

  it.skip("should... onSearchStateChange", () => {
    expect(false).toBe(true);
  });
});
