# next-instantsearch

[![npm version](https://badge.fury.io/js/next-instantsearch.svg)](https://badge.fury.io/js/next-instantsearch)
![Test](https://github.com/stuart-williams/next-instantsearch/workflows/Test/badge.svg)
![Publish](https://github.com/stuart-williams/next-instantsearch/workflows/Publish/badge.svg)

🚧Under Construction

## Installation

```sh
npm install next-instantsearch
# or
yarn add next-instantsearch
```

## Getting started

Use the `withInstantSearch` HOC to configure [InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/#the-instantsearch-root-widget) and enable [SSR](https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/#nextjs)!:

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
