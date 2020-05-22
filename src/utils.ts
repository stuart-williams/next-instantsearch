import { NextRouter } from "next/router";
import qs from "qs";
import url from "url";

export const createURL = (searchState: any) => `?${qs.stringify(searchState)}`;

export const pathToSearchState = (path: string) =>
  qs.parse(url.parse(path).query || "");

export const onSearchStateChange = (searchState: any, Router: NextRouter) => {
  const urlObject = url.parse(Router.asPath);
  const urlParams = qs.parse(urlObject.query || "");

  const href = {
    pathname: Router.pathname,
    query: Router.query,
  };

  const as = urlObject.pathname + createURL({ ...urlParams, ...searchState });

  Router.replace(href, as, { shallow: true });
};
