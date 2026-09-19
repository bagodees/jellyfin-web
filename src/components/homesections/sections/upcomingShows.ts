import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { getShowApi } from '@jellyfin/sdk/lib/utils/api/show-api';
import type { ApiClient } from 'jellyfin-apiclient';

import cardBuilder from 'components/cardbuilder/cardBuilder';
import { getBackdropShape } from 'components/cardbuilder/utils/shape';
import globalize from 'lib/globalize';
import ServerConnections from 'lib/jellyfin-apiclient/ServerConnections';

import type { SectionContainerElement, SectionOptions } from './section';

export function loadUpcomingShows(elem: HTMLElement, apiClient: ApiClient, options: SectionOptions) {
    const containerClass = options.enableOverflow ? ' scrollSlider' : ' padded-left padded-right vertical-wrap';
    const scrollerClass = options.enableOverflow ? 'padded-top-focusscale padded-bottom-focusscale' : '';
    elem.classList.add('hide');
    elem.innerHTML = `<h2 class="sectionTitle sectionTitle-cards padded-left">${globalize.translate('UpcomingShows')}</h2><div is="emby-scroller" class="${scrollerClass}"><div is="emby-itemscontainer" class="itemsContainer${containerClass} focuscontainer-x" data-monitor="videoplayback,markplayed"></div></div>`;

    const itemsContainer: SectionContainerElement | null = elem.querySelector('.itemsContainer');
    if (!itemsContainer) return;
    itemsContainer.fetchData = async () => {
        const api = ServerConnections.getApi(apiClient.serverId());
        if (!api) return [];
        const response = await getShowApi(api).getUpcomingEpisodes({
            userId: apiClient.getCurrentUserId(),
            limit: options.enableOverflow ? 24 : 12,
            fields: [ItemFields.PrimaryImageAspectRatio, ItemFields.AirTime],
            imageTypeLimit: 1,
            enableImageTypes: [ImageType.Primary, ImageType.Backdrop, ImageType.Thumb],
            enableUserData: true
        });
        return response.data.Items ?? [];
    };
    itemsContainer.getItemsHtml = (items: BaseItemDto[]) => cardBuilder.getCardsHtml({
        items, preferThumb: true, shape: getBackdropShape(options.enableOverflow), showTitle: true,
        showParentTitle: true, overlayPlayButton: true, context: 'home', centerText: true, lines: 2
    });
    itemsContainer.parentContainer = elem;
}
