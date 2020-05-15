const mockFindResultsState = jest.fn().mockResolvedValue("results_state");

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
    const searchState = {
      refinementList: {
        categories: ["Appliances"],
      },
      page: "1",
    };
    const ctx = { asPath } as NextPageContext;

    const Component = () => null;
    Component.getInitialProps = jest.fn().mockResolvedValue({
      foo: true,
    });

    const WrappedComponent = withInstantSearch({ indexName, searchClient })(
      Component
    );

    const pageProps = await WrappedComponent.getInitialProps(ctx);

    expect(Component.getInitialProps).toHaveBeenCalledWith(ctx);

    expect(mockFindResultsState.mock.calls[0][0].name).toBe("InstantSearchApp");

    expect(mockFindResultsState.mock.calls[0][1]).toEqual({
      indexName,
      searchClient,
      searchState,
    });

    expect(pageProps).toEqual({
      foo: true,
      indexName,
      searchState,
      resultsState: "results_state",
    });

    // Set results state undefined to prevent InstantSearch crapping out
    const wrapper = mount(
      <WrappedComponent {...pageProps} resultsState={undefined} bar={true} />
    );

    expect(wrapper.find("InstantSearchApp").props()).toEqual({
      foo: true,
      bar: true,
      indexName,
      searchState,
      resultsState: undefined,
    });

    expect(wrapper.find(Component).props()).toEqual({
      foo: true,
      bar: true,
      indexName,
      searchState,
      resultsState: undefined,
    });
  });
});
