// NOTE: This should be included in the OpenAPI spec ideally
// https://github.com/jellyfin/jellyfin/blob/1b4394199a2f9883cd601bdb8c9d66015397aa52/Jellyfin.Data/Enums/HomeSectionType.cs
export enum HomeSectionType {
    None = 'none',
    SmallLibraryTiles = 'smalllibrarytiles',
    LibraryButtons = 'librarybuttons',
    ActiveRecordings = 'activerecordings',
    Resume = 'resume',
    ResumeAudio = 'resumeaudio',
    LatestMedia = 'latestmedia',
    NextUp = 'nextup',
    LiveTv = 'livetv',
    ResumeBook = 'resumebook',
    RecentlyAddedMovies = 'recentlyaddedmovies',
    RecentlyAddedShows = 'recentlyaddedshows',
    RecentlyAddedAlbums = 'recentlyaddedalbums',
    RecentlyAddedArtists = 'recentlyaddedartists',
    RecentlyAddedBooks = 'recentlyaddedbooks',
    RecentlyAddedAudiobooks = 'recentlyaddedaudiobooks',
    RecentlyAddedMusicVideos = 'recentlyaddedmusicvideos',
    Collections = 'collections',
    ContinueWatchingNextUp = 'continuewatchingnextup',
    LatestMovies = 'latestmovies',
    LatestShows = 'latestshows',
    LatestAlbums = 'latestalbums',
    LatestBooks = 'latestbooks',
    LatestAudiobooks = 'latestaudiobooks',
    LatestMusicVideos = 'latestmusicvideos',
    MyList = 'mylist',
    WatchAgain = 'watchagain',
    UpcomingShows = 'upcomingshows',
    UpcomingMovies = 'upcomingmovies',
    UpcomingMusic = 'upcomingmusic',
    UpcomingBooks = 'upcomingbooks',
    Genre = 'genre'
}

// NOTE: This needs to match the server defaults
// https://github.com/jellyfin/jellyfin/blob/1b4394199a2f9883cd601bdb8c9d66015397aa52/Jellyfin.Api/Controllers/DisplayPreferencesController.cs#L120
export const CONFIGURABLE_SECTIONS: HomeSectionType[] = [
    HomeSectionType.SmallLibraryTiles,
    HomeSectionType.Resume,
    HomeSectionType.NextUp,
    HomeSectionType.ContinueWatchingNextUp,
    HomeSectionType.RecentlyAddedMovies,
    HomeSectionType.RecentlyAddedShows,
    HomeSectionType.RecentlyAddedAlbums,
    HomeSectionType.RecentlyAddedArtists,
    HomeSectionType.RecentlyAddedBooks,
    HomeSectionType.RecentlyAddedAudiobooks,
    HomeSectionType.RecentlyAddedMusicVideos,
    HomeSectionType.LatestMovies,
    HomeSectionType.LatestShows,
    HomeSectionType.LatestAlbums,
    HomeSectionType.LatestBooks,
    HomeSectionType.LatestAudiobooks,
    HomeSectionType.LatestMusicVideos,
    HomeSectionType.LiveTv,
    HomeSectionType.MyList,
    HomeSectionType.WatchAgain,
    HomeSectionType.Collections,
    HomeSectionType.UpcomingShows,
    HomeSectionType.UpcomingMovies,
    HomeSectionType.UpcomingMusic,
    HomeSectionType.UpcomingBooks,
    HomeSectionType.Genre
];

export const DEFAULT_SECTIONS = CONFIGURABLE_SECTIONS;
