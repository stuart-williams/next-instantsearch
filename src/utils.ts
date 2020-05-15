import qs from "qs";
import url from "url";

export const createURL = (searchState: any) => `?${qs.stringify(searchState)}`;

export const pathToSearchState = (path: string) =>
  qs.parse(url.parse(path).query || "");
