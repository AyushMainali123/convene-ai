import { INITIAL_PAGE } from '@/app/constants';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useMeetingsFilter() {
    return useQueryStates({
        search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(INITIAL_PAGE).withOptions({ clearOnDefault: true }),
    })
}