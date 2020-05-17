# next-instantsearch

[![npm version](https://badge.fury.io/js/next-instantsearch.svg)](https://badge.fury.io/js/next-instantsearch)
![Test](https://github.com/stuart-williams/next-instantsearch/workflows/Test/badge.svg)
![Publish](https://github.com/stuart-williams/next-instantsearch/workflows/Publish/badge.svg)
![Bundlephobia](https://badgen.net/bundlephobia/minzip/next-instantsearch)

**Server side rendering with Next.js and React InstantSearch**

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
import { withInstantSearch, createURL } from "next-instantsearch";

withInstantSearch({
  indexName: "your_index",
  searchClient,
  onSearchStateChange: (searchState, { pathname, query, asPath }) => {
    const href = { pathname, query };
    const as = url.parse(asPath).pathname + createURL(searchState);

    Router.replace(href, as, { shallow: true });
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
