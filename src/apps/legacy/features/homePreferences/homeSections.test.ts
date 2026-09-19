import { describe, expect, it } from 'vitest';

import { HomeSectionType } from 'constants/homeSectionType';

import { getSavedHomeSections } from './homeSections';

const noDefault = () => HomeSectionType.None;

describe('getSavedHomeSections', () => {
    it('replaces the retired combined recently added section with movies and shows', () => {
        const settings = {
            get: (name: string) => name === 'homesection0' ? HomeSectionType.LatestMedia : HomeSectionType.None
        };

        expect(getSavedHomeSections(settings, noDefault)).toEqual([
            HomeSectionType.RecentlyAddedMovies,
            HomeSectionType.RecentlyAddedShows
        ]);
    });

    it('removes duplicate sections created during migration', () => {
        const sections = [
            HomeSectionType.LatestMedia,
            HomeSectionType.RecentlyAddedMovies,
            HomeSectionType.RecentlyAddedAlbums
        ];
        const settings = {
            get: (name: string) => sections[Number(name.replace('homesection', ''))] ?? HomeSectionType.None
        };

        expect(getSavedHomeSections(settings, noDefault)).toEqual([
            HomeSectionType.RecentlyAddedMovies,
            HomeSectionType.RecentlyAddedShows,
            HomeSectionType.RecentlyAddedAlbums
        ]);
    });
});
