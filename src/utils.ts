import merge from "deepmerge";
import { NextRouter } from "next/router";
import qs from "qs";
import url from "url";

export const createURL = (searchState: any) => `?${qs.stringify(searchState)}`;

export const pathToSearchState = (path: string) =>
  qs.parse(url.parse(path).query || "");

export const onSearchStateChange = (searchState: any, router: NextRouter) => {
  const href = router.pathname;
  const { pathname, query } = url.parse(router.asPath);
  const params = qs.parse(query || "");
  const as = pathname + createURL(merge(params, searchState));

  router.replace(href, as, { shallow: true });
};
