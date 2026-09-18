import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getBackdropShape, getPortraitShape, getSquareShape } from 'components/cardbuilder/utils/shape';
import globalize from 'lib/globalize';
import ServerConnections from 'lib/jellyfin-apiclient/ServerConnections';

import type { SectionContainerElement, SectionOptions } from './section';

type SectionDefinition = {
    itemType: BaseItemKind;
    title: string;
    shape: 'backdrop' | 'portrait' | 'square';
};

const definitions: Record<string, SectionDefinition> = {
    recentlyaddedmovies: { itemType: BaseItemKind.Movie, title: 'HeaderLatestMovies', shape: 'portrait' },
    recentlyaddedshows: { itemType: BaseItemKind.Series, title: 'RecentlyAddedShows', shape: 'backdrop' },
    recentlyaddedalbums: { itemType: BaseItemKind.MusicAlbum, title: 'RecentlyAddedAlbums', shape: 'square' },
    recentlyaddedartists: { itemType: BaseItemKind.MusicArtist, title: 'RecentlyAddedArtists', shape: 'square' },
    recentlyaddedbooks: { itemType: BaseItemKind.Book, title: 'HeaderLatestBooks', shape: 'portrait' },
    recentlyaddedaudiobooks: { itemType: BaseItemKind.AudioBook, title: 'RecentlyAddedAudiobooks', shape: 'portrait' },
    recentlyaddedmusicvideos: { itemType: BaseItemKind.MusicVideo, title: 'HeaderLatestMusicVideos', shape: 'backdrop' }
};

function getShape(shape: SectionDefinition['shape'], enableOverflow: boolean) {
    if (shape === 'backdrop') return getBackdropShape(enableOverflow);
    if (shape === 'square') return getSquareShape(enableOverflow);
    return getPortraitShape(enableOverflow);
}

export function loadRecentlyAddedByType(
    elem: HTMLElement,
    apiClient: ApiClient,
    section: string,
    options: SectionOptions
) {
    const definition = definitions[section];
    if (!definition) return;

    const containerClass = options.enableOverflow ? ' scrollSlider' : ' padded-left padded-right vertical-wrap';
    const scrollerClass = options.enableOverflow ? 'padded-top-focusscale padded-bottom-focusscale' : '';

    elem.classList.add('hide');
    elem.innerHTML = `<h2 class="sectionTitle sectionTitle-cards padded-left">${globalize.translate(definition.title)}</h2><div is="emby-scroller" class="${scrollerClass}"><div is="emby-itemscontainer" class="itemsContainer${containerClass} focuscontainer-x" data-monitor="markfavorite,markplayed"></div></div>`;

    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;

    itemsContainer.fetchData = async () => {
        const api = ServerConnections.getApi(apiClient.serverId());
        if (!api) return [];

        const response = await getLibraryApi(api).getItems({
            enableImageTypes: [ ImageType.Primary, ImageType.Backdrop, ImageType.Thumb ],
            enableTotalRecordCount: false,
            fields: [ ItemFields.PrimaryImageAspectRatio, ItemFields.DateCreated ],
            imageTypeLimit: 1,
            includeItemTypes: [ definition.itemType ],
            limit: options.enableOverflow ? 24 : 12,
            recursive: true,
            sortBy: [ ItemSortBy.DateCreated ],
            sortOrder: [ SortOrder.Descending ],
            userId: apiClient.getCurrentUserId()
        });
        return response.data.Items ?? [];
    };
    itemsContainer.getItemsHtml = (items: BaseItemDto[]) => cardBuilder.getCardsHtml({
        items,
        shape: getShape(definition.shape, options.enableOverflow),
        preferThumb: definition.shape === 'backdrop',
        showParentTitle: definition.shape !== 'portrait',
        showTitle: true,
        showUnplayedIndicator: false,
        overlayPlayButton: true,
        context: 'home',
        centerText: true,
        lines: 2
    });
    itemsContainer.parentContainer = elem;
}
