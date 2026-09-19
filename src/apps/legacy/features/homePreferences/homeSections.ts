import { HomeSectionType } from 'constants/homeSectionType';

export const MAX_HOME_SECTIONS = 16;

export const editableHomeSections = [
    HomeSectionType.SmallLibraryTiles,
    HomeSectionType.LibraryButtons,
    HomeSectionType.ActiveRecordings,
    HomeSectionType.Resume,
    HomeSectionType.ResumeAudio,
    HomeSectionType.ResumeBook,
    HomeSectionType.NextUp,
    HomeSectionType.LiveTv,
    HomeSectionType.RecentlyAddedMovies,
    HomeSectionType.RecentlyAddedShows,
    HomeSectionType.RecentlyAddedAlbums,
    HomeSectionType.RecentlyAddedArtists,
    HomeSectionType.RecentlyAddedBooks,
    HomeSectionType.RecentlyAddedAudiobooks,
    HomeSectionType.RecentlyAddedMusicVideos,
    HomeSectionType.Collections,
    HomeSectionType.WatchAgain,
    HomeSectionType.MyList,
    HomeSectionType.ContinueWatchingNextUp,
    HomeSectionType.UpcomingShows,
    HomeSectionType.Genres, HomeSectionType.LatestMovies, HomeSectionType.LatestShows,
    HomeSectionType.LatestAlbums, HomeSectionType.LatestBooks, HomeSectionType.LatestAudiobooks,
    HomeSectionType.LatestMusicVideos
] as const;

export type EditableHomeSection = typeof editableHomeSections[number];

export interface HomeSectionSettings {
    get: (name: string) => string | null | undefined;
}

function isEditableHomeSection(value: string | null | undefined): value is EditableHomeSection {
    return editableHomeSections.includes(value as EditableHomeSection);
}

export function getSavedHomeSections(
    userSettings: HomeSectionSettings,
    getDefaultSection: (index: number) => HomeSectionType
): EditableHomeSection[] {
    const saved: EditableHomeSection[] = [];

    for (let index = 0; index < MAX_HOME_SECTIONS; index++) {
        const section = userSettings.get(`homesection${index}`) || getDefaultSection(index);
        if (section === HomeSectionType.LatestMedia) {
            saved.push(HomeSectionType.RecentlyAddedMovies, HomeSectionType.RecentlyAddedShows);
        } else if (isEditableHomeSection(section)) {
            saved.push(section);
        }
    }

    return saved.filter((section, index) => saved.indexOf(section) === index);
}
