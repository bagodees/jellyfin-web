import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getBackdropShape, getPortraitShape, getSquareShape } from 'components/cardbuilder/utils/shape';

import type { SectionContainerElement, SectionOptions } from './section';

type Query = Record<string, string | number | boolean | undefined>;

const definitions: Record<string, { title: string; query: Query; shape?: 'backdrop' | 'square' }> = {
    continuewatchingnextup: { title: 'Continue Watching / Next Up', query: { IncludeItemTypes: 'Movie,Episode', Filters: 'IsResumable', SortBy: 'DatePlayed', SortOrder: 'Descending' }, shape: 'backdrop' },
    recentlyaddedmovies: { title: 'Recently Added Movies', query: { IncludeItemTypes: 'Movie', SortBy: 'DateCreated', SortOrder: 'Descending' } },
    recentlyaddedshows: { title: 'Recently Added Shows', query: { IncludeItemTypes: 'Series', SortBy: 'DateCreated', SortOrder: 'Descending' } },
    recentlyaddedalbums: { title: 'Recently Added Albums', query: { IncludeItemTypes: 'MusicAlbum', SortBy: 'DateCreated', SortOrder: 'Descending' }, shape: 'square' },
    recentlyaddedartists: { title: 'Recently Added Artists', query: { IncludeItemTypes: 'MusicArtist', SortBy: 'DateCreated', SortOrder: 'Descending' }, shape: 'square' },
    recentlyaddedbooks: { title: 'Recently Added Books', query: { IncludeItemTypes: 'Book', SortBy: 'DateCreated', SortOrder: 'Descending' } },
    recentlyaddedaudiobooks: { title: 'Recently Added Audiobooks', query: { IncludeItemTypes: 'AudioBook', SortBy: 'DateCreated', SortOrder: 'Descending' } },
    recentlyaddedmusicvideos: { title: 'Recently Added Music Videos', query: { IncludeItemTypes: 'MusicVideo', SortBy: 'DateCreated', SortOrder: 'Descending' }, shape: 'backdrop' },
    latestmovies: { title: 'Latest Movies', query: { IncludeItemTypes: 'Movie', SortBy: 'PremiereDate', SortOrder: 'Descending' } },
    latestshows: { title: 'Latest Shows', query: { IncludeItemTypes: 'Series', SortBy: 'PremiereDate', SortOrder: 'Descending' } },
    latestalbums: { title: 'Latest Albums', query: { IncludeItemTypes: 'MusicAlbum', SortBy: 'PremiereDate', SortOrder: 'Descending' }, shape: 'square' },
    latestbooks: { title: 'Latest Books', query: { IncludeItemTypes: 'Book', SortBy: 'PremiereDate', SortOrder: 'Descending' } },
    latestaudiobooks: { title: 'Latest Audiobooks', query: { IncludeItemTypes: 'AudioBook', SortBy: 'PremiereDate', SortOrder: 'Descending' } },
    latestmusicvideos: { title: 'Latest Music Videos', query: { IncludeItemTypes: 'MusicVideo', SortBy: 'PremiereDate', SortOrder: 'Descending' }, shape: 'backdrop' },
    mylist: { title: 'My List', query: { Filters: 'IsFavorite', SortBy: 'DateFavorite', SortOrder: 'Descending' } },
    watchagain: { title: 'Watch Again', query: { Filters: 'IsPlayed', SortBy: 'DatePlayed', SortOrder: 'Descending' }, shape: 'backdrop' },
    collections: { title: 'Collections', query: { IncludeItemTypes: 'BoxSet', SortBy: 'SortName', SortOrder: 'Ascending' } },
    upcomingshows: { title: 'Upcoming Shows', query: { IncludeItemTypes: 'Series', SortBy: 'PremiereDate', SortOrder: 'Ascending', MinPremiereDate: new Date().toISOString() } },
    upcomingmovies: { title: 'Upcoming Movies', query: { IncludeItemTypes: 'Movie', SortBy: 'PremiereDate', SortOrder: 'Ascending', MinPremiereDate: new Date().toISOString() } },
    upcomingmusic: { title: 'Upcoming Music', query: { IncludeItemTypes: 'MusicAlbum', SortBy: 'PremiereDate', SortOrder: 'Ascending', MinPremiereDate: new Date().toISOString() }, shape: 'square' },
    upcomingbooks: { title: 'Upcoming Books', query: { IncludeItemTypes: 'Book,AudioBook', SortBy: 'PremiereDate', SortOrder: 'Ascending', MinPremiereDate: new Date().toISOString() } },
    genre: { title: 'Genres', query: { IncludeItemTypes: 'Genre', SortBy: 'SortName', SortOrder: 'Ascending' }, shape: 'square' }
};

export function loadCustomSection(elem: HTMLElement, apiClient: ApiClient, section: string, options: SectionOptions) {
    const definition = definitions[section];
    if (!definition) return;

    const containerClass = options.enableOverflow ? ' scrollSlider' : ' padded-left padded-right vertical-wrap';
    const scrollerClass = options.enableOverflow ? 'padded-top-focusscale padded-bottom-focusscale' : '';
    elem.classList.add('hide');
    elem.innerHTML = `<h2 class="sectionTitle sectionTitle-cards padded-left">${definition.title}</h2><div is="emby-scroller" class="${scrollerClass}"><div is="emby-itemscontainer" class="itemsContainer${containerClass} focuscontainer-x" data-monitor="markfavorite,markplayed"></div></div>`;

    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;
    itemsContainer.fetchData = () => apiClient.getItems(apiClient.getCurrentUserId(), {
        Limit: options.enableOverflow ? 24 : 12,
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,DateCreated,PremiereDate',
        ImageTypeLimit: 1,
        EnableImageTypes: 'Primary,Backdrop,Thumb',
        ...definition.query
    });
    itemsContainer.getItemsHtml = (items: BaseItemDto[]) => cardBuilder.getCardsHtml({
        items,
        shape: definition.shape === 'square' ? getSquareShape(options.enableOverflow) : definition.shape === 'backdrop' ? getBackdropShape(options.enableOverflow) : getPortraitShape(options.enableOverflow),
        preferThumb: definition.shape === 'backdrop',
        showTitle: true,
        showParentTitle: true,
        showUnplayedIndicator: false,
        overlayPlayButton: section !== 'genre',
        context: 'home',
        centerText: true,
        lines: 2
    });
    itemsContainer.parentContainer = elem;
}
