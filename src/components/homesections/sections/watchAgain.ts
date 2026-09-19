import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getBackdropShape } from 'components/cardbuilder/utils/shape';
import globalize from 'lib/globalize';
import ServerConnections from 'lib/jellyfin-apiclient/ServerConnections';

import type { SectionContainerElement, SectionOptions } from './section';

export const watchAgainQuery = {
    filters: [ItemFilter.IsPlayed],
    includeItemTypes: [BaseItemKind.Movie, BaseItemKind.Episode, BaseItemKind.MusicVideo],
    isPlayed: true,
    sortBy: [ItemSortBy.DatePlayed],
    sortOrder: [SortOrder.Descending]
};

export function loadWatchAgain(elem: HTMLElement, apiClient: ApiClient, options: SectionOptions) {
    const containerClass = options.enableOverflow ? ' scrollSlider' : ' padded-left padded-right vertical-wrap';
    const scrollerClass = options.enableOverflow ? 'padded-top-focusscale padded-bottom-focusscale' : '';

    elem.classList.add('hide');
    elem.innerHTML = `<h2 class="sectionTitle sectionTitle-cards padded-left">${globalize.translate('WatchAgain')}</h2><div is="emby-scroller" class="${scrollerClass}"><div is="emby-itemscontainer" class="itemsContainer${containerClass} focuscontainer-x" data-monitor="videoplayback,markplayed"></div></div>`;

    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;

    itemsContainer.fetchData = async () => {
        const api = ServerConnections.getApi(apiClient.serverId());
        if (!api) return [];

        const response = await getLibraryApi(api).getItems({
            ...watchAgainQuery,
            enableImageTypes: [ImageType.Primary, ImageType.Backdrop, ImageType.Thumb],
            enableTotalRecordCount: false,
            fields: [ItemFields.PrimaryImageAspectRatio, ItemFields.DatePlayed],
            imageTypeLimit: 1,
            limit: options.enableOverflow ? 24 : 12,
            recursive: true,
            userId: apiClient.getCurrentUserId()
        });
        return response.data.Items ?? [];
    };
    itemsContainer.getItemsHtml = (items: BaseItemDto[]) => cardBuilder.getCardsHtml({
        items,
        shape: getBackdropShape(options.enableOverflow),
        preferThumb: true,
        showParentTitle: true,
        showTitle: true,
        showUnplayedIndicator: false,
        overlayPlayButton: true,
        context: 'home',
        centerText: true,
        lines: 2
    });
    itemsContainer.parentContainer = elem;
}
