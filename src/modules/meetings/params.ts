import { parseAsInteger, parseAsString, createLoader } from 'nuqs/server';
import { INITIAL_PAGE } from "@/app/constants";

export const filterSearchParams = {
    search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(INITIAL_PAGE).withOptions({ clearOnDefault: true }),
}

export const loadSearchParams = createLoader(filterSearchParams);