const mockFindResultsState = jest.fn().mockResolvedValue("some results");

import algoliasearch from "algoliasearch/lite";
import { mount } from "enzyme";
import { NextPageContext } from "next";
import React from "react";

import withInstantSearch from "./with-instantsearch";

jest.mock("react-instantsearch-dom/server", () => ({
  findResultsState: mockFindResultsState,
}));

describe("withInstantSearch", () => {
  const indexName = "some_index";
  const searchClient = algoliasearch("app_id", "api_key");

  it("should handle SSR", async () => {
    const asPath = "/?refinementList%5Bcategories%5D%5B0%5D=Appliances&page=1";

    const expectedSearchState = {
      refinementList: {
        categories: ["Appliances", "TV & Home Theater"],
      },
      page: "1",
    };

    const ctx = { asPath } as NextPageContext;

    // Create mock page component
    const Component = () => null;
    Component.getInitialProps = jest.fn().mockResolvedValue({
      foo: true,
      searchState: {
        refinementList: {
          categories: ["TV & Home Theater"],
        },
      },
    });

    // Wrap it with hoc
    const WrappedComponent = withInstantSearch({ indexName, searchClient })(
      Component
    );

    // Simulate getInitialProps lifecycle
    const pageProps = await WrappedComponent.getInitialProps(ctx);

    // Check wrapped component getInitialProps was called
    expect(Component.getInitialProps).toHaveBeenCalledWith(ctx);

    // Check react-instantsearch-dom/server SSR function was called
    expect(mockFindResultsState.mock.calls[0][1]).toEqual({
      indexName,
      searchClient,
      searchState: expectedSearchState,
    });

    // Check pageProps contains merged searchState and SSR resultsState
    expect(pageProps).toEqual({
      foo: true,
      indexName,
      searchState: expectedSearchState,
      resultsState: "some results",
    });

    // Set resultsState undefined to prevent InstantSearch crapping out
    const wrapper = mount(
      <WrappedComponent {...pageProps} resultsState={undefined} bar={true} />
    );

    // Check correct props are passed to the InstantSearch provider
    expect(wrapper.find("InstantSearch").prop("indexName")).toEqual(indexName);
    expect(wrapper.find("InstantSearch").prop("searchState")).toEqual(
      expectedSearchState
    );
    expect(wrapper.find("InstantSearch").prop("searchClient")).toEqual(
      searchClient
    );
    expect(wrapper.find("InstantSearch").prop("createURL")).toEqual(
      expect.any(Function)
    );
    expect(wrapper.find("InstantSearch").prop("onSearchStateChange")).toEqual(
      expect.any(Function)
    );

    // Check correct props are passed to the wrapped component
    expect(wrapper.find(Component).props()).toEqual(
      expect.objectContaining({
        foo: true,
        bar: true,
      })
    );
  });
});
