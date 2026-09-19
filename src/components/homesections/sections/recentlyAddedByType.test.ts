import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { describe, expect, it } from 'vitest';

import { recentlyAddedSectionDefinitions } from './recentlyAddedDefinitions';

describe('recentlyAddedSectionDefinitions', () => {
    it('maps every typed recently added section to its Jellyfin item kind', () => {
        expect(recentlyAddedSectionDefinitions).toMatchObject({
            recentlyaddedmovies: { itemType: BaseItemKind.Movie, shape: 'portrait' },
            recentlyaddedshows: { itemType: BaseItemKind.Series, shape: 'backdrop' },
            recentlyaddedalbums: { itemType: BaseItemKind.MusicAlbum, shape: 'square' },
            recentlyaddedartists: { itemType: BaseItemKind.MusicArtist, shape: 'square' },
            recentlyaddedbooks: { itemType: BaseItemKind.Book, shape: 'portrait' },
            recentlyaddedaudiobooks: { itemType: BaseItemKind.AudioBook, shape: 'portrait' },
            recentlyaddedmusicvideos: { itemType: BaseItemKind.MusicVideo, shape: 'backdrop' },
            collections: { itemType: BaseItemKind.BoxSet, shape: 'portrait' },
            latestmovies: { itemType: BaseItemKind.Movie, shape: 'portrait', releaseBased: true },
            latestshows: { itemType: BaseItemKind.Series, shape: 'backdrop', releaseBased: true },
            latestalbums: { itemType: BaseItemKind.MusicAlbum, shape: 'square', releaseBased: true },
            latestbooks: { itemType: BaseItemKind.Book, shape: 'portrait', releaseBased: true },
            latestaudiobooks: { itemType: BaseItemKind.AudioBook, shape: 'portrait', releaseBased: true },
            latestmusicvideos: { itemType: BaseItemKind.MusicVideo, shape: 'backdrop', releaseBased: true }
        });
    });
});
