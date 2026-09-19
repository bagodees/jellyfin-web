import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { describe, expect, it } from 'vitest';

import { watchAgainQuery } from './watchAgain';

describe('watchAgainQuery', () => {
    it('returns completed video items in most-recently-played order', () => {
        expect(watchAgainQuery).toEqual({
            filters: [ItemFilter.IsPlayed],
            includeItemTypes: [BaseItemKind.Movie, BaseItemKind.Episode, BaseItemKind.MusicVideo],
            isPlayed: true,
            sortBy: [ItemSortBy.DatePlayed],
            sortOrder: [SortOrder.Descending]
        });
    });
});
