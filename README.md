# next-instantsearch

[![npm version](https://badge.fury.io/js/next-instantsearch.svg)](https://badge.fury.io/js/next-instantsearch)
[![Test](https://github.com/stuart-williams/next-instantsearch/workflows/Test/badge.svg)](https://github.com/stuart-williams/next-instantsearch/actions?query=workflow%3ATest)
[![Publish](https://github.com/stuart-williams/next-instantsearch/workflows/Publish/badge.svg)](https://github.com/stuart-williams/next-instantsearch/actions?query=workflow%3APublish)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/next-instantsearch)](https://bundlephobia.com/result?p=next-instantsearch)

**Server side rendering with Next.js and React InstantSearch**

## What is it?

`next-instantsearch` is a plugin for [Next.js](https://nextjs.org/) projects that allows you to easily configure your [Algolia](https://www.algolia.com/) powered [InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/) app, while fully supporting SSR.

`next-instantsearch` is only compatible with InstantSearch v6. See the [upgrade guides](https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/react/) for more info.

## Installation

```sh
npm install next-instantsearch
# or
yarn add next-instantsearch
```

## Getting started

Use the `withInstantSearch` HOC to configure [InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/#the-instantsearch-root-widget) and enable [SSR](https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/):

```javascript
import algoliasearch from "algoliasearch/lite";
import { withInstantSearch } from "next-instantsearch";
import {
  Configure,
  Highlight,
  Hits,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-dom";

const searchClient = algoliasearch("your_app_id", "your_api_key");

const HitComponent = ({ hit }) => <Highlight attribute="name" hit={hit} />;

const Page = () => (
  <>
    <Configure hitsPerPage={12} />
    <SearchBox />
    <RefinementList attribute="categories" />
    <Hits hitComponent={HitComponent} />
    <Pagination />
  </>
);

export default withInstantSearch({
  indexName: "your_index",
  searchClient,
})(Page);
```

You may also configure via `getInitialProps`:

```javascript
import algoliasearch from "algoliasearch/lite";
import { withInstantSearch } from "next-instantsearch";
import {
  Configure,
  Highlight,
  Hits,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-dom";

const searchClient = algoliasearch("your_app_id", "your_api_key");

const HitComponent = ({ hit }) => <Highlight attribute="name" hit={hit} />;

const Page = () => (
  <>
    <Configure hitsPerPage={12} />
    <SearchBox />
    <RefinementList attribute="categories" />
    <Hits hitComponent={HitComponent} />
    <Pagination />
  </>
);

Page.getInitialProps = async () => ({
  indexName: "your_index",
  // You may want to set some default searchState.
  // This will be merged on to state from the url.
  searchState: {
    refinementList: {
      categories: ["Appliances"],
    },
  },
});

export default withInstantSearch({
  searchClient,
})(Page);
```

## Advanced Usage

Out of the box `next-instantsearch` will trigger a shallow route replace when your search state changes.
This may not work for you if you're using a non standard router or maybe you want to prevent this route change with a no-op.

```javascript
import { withInstantSearch, createURL, onSearchStateChange } from "next-instantsearch";
import { Router } from "../i18n";

withInstantSearch({
  indexName: "your_index",
  searchClient,
  onSearchStateChange: (searchState) => onSearchStateChange(searchState, Router),
  // or
  onSearchStateChange: () => {}, // Prevent route change
  // or
  onSearchStateChange: (searchState, Router) => {
    // ... Some custom implementation ...
  },
})(Page);
```

You may need to decorate your component with some wrapper components due to the way `react-instantsearch-dom` handles [server side rendering](https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/).

```javascript
withInstantSearch({
  indexName: "your_index",
  searchClient,
  decorate: ({ ctx, component }) => (
    <Provider store={ctx.store}>{component()}</Provider>
  ),
})(Page);
```
