import { SearchClient } from "@algolia/client-search";
import merge from "deepmerge";
import hoistNonReactStatics from "hoist-non-react-statics";
import { NextComponentType, NextPageContext } from "next";
import { NextRouter, useRouter } from "next/router";
import React, { useState } from "react";
import { InstantSearch } from "react-instantsearch-dom";
import { findResultsState } from "react-instantsearch-dom/server";

import {
  createURL,
  onSearchStateChange as defaultOnSearchStateChange,
  pathToSearchState,
} from "./utils";

export type WithInstantSearchOptions = {
  searchClient: SearchClient;
  indexName?: string;
  decorate?: (args: {
    ctx: NextPageContext;
    component: () => React.ReactElement;
  }) => React.ReactElement;
  onSearchStateChange?: (searchState: any, router: NextRouter) => any;
};

const withInstantSearch = (options: WithInstantSearchOptions) => (
  WrappedComponent: NextComponentType | any
) => {
  const onSearchStateChange =
    options.onSearchStateChange || defaultOnSearchStateChange;

  const InstantSearchApp = (props: any) => {
    const [searchState, setSearchState] = useState(props.searchState);
    const router = useRouter();
    const indexName = props.indexName || options.indexName;

    const handleSearchStateChange = (state: any) => {
      setSearchState(state);
      onSearchStateChange(state, router);
    };

    return (
      <InstantSearch
        {...props}
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

    const InstantSearchSSR = (props: any) => {
      const component = () => <InstantSearchApp {...props} {...pageProps} />;

      return options.decorate
        ? options.decorate({ ctx, component })
        : component();
    };

    const resultsState = await findResultsState(InstantSearchSSR, {
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
