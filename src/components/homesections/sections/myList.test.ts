import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { describe, expect, it } from 'vitest';

import { myListQuery } from './myList';

describe('myListQuery', () => {
    it('returns the user’s favorite media in newest-first order', () => {
        expect(myListQuery).toMatchObject({
            filters: [ItemFilter.IsFavorite],
            includeItemTypes: expect.arrayContaining([BaseItemKind.Movie, BaseItemKind.BoxSet]),
            isFavorite: true,
            sortBy: [ItemSortBy.DateCreated],
            sortOrder: [SortOrder.Descending]
        });
    });
});
