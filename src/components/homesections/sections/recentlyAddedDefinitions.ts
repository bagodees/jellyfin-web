import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';

export type RecentlyAddedSectionDefinition = {
    itemType: BaseItemKind;
    title: string;
    shape: 'backdrop' | 'portrait' | 'square';
};

export const recentlyAddedSectionDefinitions: Record<string, RecentlyAddedSectionDefinition> = {
    recentlyaddedmovies: { itemType: BaseItemKind.Movie, title: 'HeaderLatestMovies', shape: 'portrait' },
    recentlyaddedshows: { itemType: BaseItemKind.Series, title: 'RecentlyAddedShows', shape: 'backdrop' },
    recentlyaddedalbums: { itemType: BaseItemKind.MusicAlbum, title: 'RecentlyAddedAlbums', shape: 'square' },
    recentlyaddedartists: { itemType: BaseItemKind.MusicArtist, title: 'RecentlyAddedArtists', shape: 'square' },
    recentlyaddedbooks: { itemType: BaseItemKind.Book, title: 'HeaderLatestBooks', shape: 'portrait' },
    recentlyaddedaudiobooks: { itemType: BaseItemKind.AudioBook, title: 'RecentlyAddedAudiobooks', shape: 'portrait' },
    recentlyaddedmusicvideos: { itemType: BaseItemKind.MusicVideo, title: 'HeaderLatestMusicVideos', shape: 'backdrop' },
    collections: { itemType: BaseItemKind.BoxSet, title: 'Collections', shape: 'portrait' }
};
