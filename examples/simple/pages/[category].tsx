import algoliasearch from "algoliasearch/lite";
import { NextPageContext } from "next";
import { withInstantSearch } from "next-instantsearch";
import {
  Configure,
  Highlight,
  Hits,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch-dom";

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div>
      <div className="hit-picture">
        <img src={`${hit.image}`} />
      </div>
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
        <span> - ${hit.price}</span>
        <span> - {hit.rating} stars</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={hit} />
      </div>
    </div>
  </div>
);

const Page = (props: any) => (
  <>
    <Configure hitsPerPage={12} />
    <header>
      <SearchBox />
    </header>
    <main>
      <div className="menu">
        <RefinementList attribute="categories" />
      </div>
      <div className="results">
        <Hits hitComponent={HitComponent} />
      </div>
    </main>
    <footer>
      <Pagination />
    </footer>
  </>
);

Page.getInitialProps = async (ctx: NextPageContext) => {
  const category = String(ctx.query.category);
  const CATEGORY_MAP = {
    kitchen: ["Small Kitchen Appliances"],
    entertainment: ["TV & Home Theater"],
  };

  return {
    searchState: {
      refinementList: {
        categories: CATEGORY_MAP[category] || [],
      },
    },
  };
};

export default withInstantSearch({
  indexName: "instant_search",
  searchClient: algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76"),
})(Page);
