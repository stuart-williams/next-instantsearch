import { SearchClient } from "@algolia/client-search";
import merge from "deepmerge";
import hoistNonReactStatics from "hoist-non-react-statics";
import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { findResultsState } from "react-instantsearch-dom/server";

import { createURL, pathToSearchState } from "./utils";

type WithInstantSearchOptions = {
  searchClient: SearchClient;
  indexName?: string;
  onSearchStateChange?: (searchState: any) => any;
};

const withInstantSearch = (options: WithInstantSearchOptions) => (
  WrappedComponent: NextComponentType | any
) => {
  const InstantSearchApp = (props: any) => {
    const [searchState, setSearchState] = useState(props.searchState);
    const router = useRouter();
    const indexName = props.indexName || options.indexName;

    const handleSearchStateChange = (state: any) => {
      setSearchState(state);

      if (options.onSearchStateChange) {
        options.onSearchStateChange(state);
      } else {
        router.push(router.pathname, router.asPath + createURL(state), {
          shallow: true,
        });
      }
    };

    return (
      <InstantSearch
        indexName={indexName}
        searchState={searchState}
        searchClient={options.searchClient}
        createURL={createURL}
        onSearchStateChange={handleSearchStateChange}
      >
        <WrappedComponent {...props} />
      </InstantSearch>
    );
  };

  InstantSearchApp.getInitialProps = async (ctx: NextPageContext) => {
    const { asPath = "" } = ctx;

    const getInitialProps = WrappedComponent.getInitialProps || (() => ({}));
    const pageProps: any = await getInitialProps(ctx);

    const indexName = pageProps?.indexName || options.indexName;

    const searchStateFromPath = pathToSearchState(asPath);
    const searchStateFromProps = pageProps?.searchState || {};
    const searchState = merge(searchStateFromPath, searchStateFromProps);

    const resultsState = await findResultsState(InstantSearchApp, {
      indexName,
      searchClient: options.searchClient,
      searchState,
    });

    return {
      ...pageProps,
      indexName,
      searchState,
      resultsState,
    };
  };

  return hoistNonReactStatics(InstantSearchApp, WrappedComponent, {
    getInitialProps: true,
  });
};

export default withInstantSearch;
