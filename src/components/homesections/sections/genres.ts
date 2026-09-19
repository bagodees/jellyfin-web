import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { getGenreApi } from '@jellyfin/sdk/lib/utils/api/genre-api';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getPortraitShape } from 'components/cardbuilder/utils/shape';
import globalize from 'lib/globalize';
import ServerConnections from 'lib/jellyfin-apiclient/ServerConnections';
import type { SectionContainerElement, SectionOptions } from './section';

export function loadGenres(elem: HTMLElement, apiClient: ApiClient, options: SectionOptions) {
    const containerClass = options.enableOverflow ? ' scrollSlider' : ' padded-left padded-right vertical-wrap';
    elem.classList.add('hide');
    elem.innerHTML = `<h2 class="sectionTitle sectionTitle-cards padded-left">${globalize.translate('Genres')}</h2><div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale"><div is="emby-itemscontainer" class="itemsContainer${containerClass} focuscontainer-x"></div></div>`;
    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;
    itemsContainer.fetchData = async () => {
        const api = ServerConnections.getApi(apiClient.serverId());
        if (!api) return [];
        const response = await getGenreApi(api).getGenres({ userId: apiClient.getCurrentUserId(), limit: options.enableOverflow ? 24 : 12, fields: [ItemFields.PrimaryImageAspectRatio], imageTypeLimit: 1, enableImageTypes: [ImageType.Primary, ImageType.Backdrop, ImageType.Thumb], sortBy: [ItemSortBy.SortName], sortOrder: [SortOrder.Ascending], enableTotalRecordCount: false });
        return response.data.Items ?? [];
    };
    itemsContainer.getItemsHtml = (items: BaseItemDto[]) => cardBuilder.getCardsHtml({ items, shape: getPortraitShape(options.enableOverflow), showTitle: true, context: 'home', centerText: true, lines: 2 });
    itemsContainer.parentContainer = elem;
}
