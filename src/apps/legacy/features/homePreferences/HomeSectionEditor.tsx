import Sortable from 'sortablejs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HomeSectionType } from 'constants/homeSectionType';
import globalize from 'lib/globalize';

import {
    editableHomeSections,
    getSavedHomeSections,
    MAX_HOME_SECTIONS,
    type EditableHomeSection,
    type HomeSectionSettings
} from './homeSections';
import './HomeSectionEditor.scss';

type Section = EditableHomeSection;

interface HomeSectionEditorProps {
    getDefaultSection: (index: number) => HomeSectionType;
    userSettings: HomeSectionSettings;
}

const sectionLabels: Record<Section, string> = {
    [HomeSectionType.SmallLibraryTiles]: 'HeaderMyMedia',
    [HomeSectionType.LibraryButtons]: 'HeaderMyMediaSmall',
    [HomeSectionType.ActiveRecordings]: 'HeaderActiveRecordings',
    [HomeSectionType.Resume]: 'HeaderContinueWatching',
    [HomeSectionType.ResumeAudio]: 'HeaderContinueListening',
    [HomeSectionType.ResumeBook]: 'HeaderContinueReading',
    [HomeSectionType.NextUp]: 'NextUp',
    [HomeSectionType.LiveTv]: 'LiveTV',
    [HomeSectionType.RecentlyAddedMovies]: 'HeaderLatestMovies',
    [HomeSectionType.RecentlyAddedShows]: 'RecentlyAddedShows',
    [HomeSectionType.RecentlyAddedAlbums]: 'RecentlyAddedAlbums',
    [HomeSectionType.RecentlyAddedArtists]: 'RecentlyAddedArtists',
    [HomeSectionType.RecentlyAddedBooks]: 'HeaderLatestBooks',
    [HomeSectionType.RecentlyAddedAudiobooks]: 'RecentlyAddedAudiobooks',
    [HomeSectionType.RecentlyAddedMusicVideos]: 'HeaderLatestMusicVideos',
    [HomeSectionType.Collections]: 'Collections',
    [HomeSectionType.WatchAgain]: 'WatchAgain',
    [HomeSectionType.MyList]: 'MyList',
    [HomeSectionType.ContinueWatchingNextUp]: 'ContinueWatchingNextUp'
};

function getSections(userSettings: HomeSectionSettings, getDefaultSection: HomeSectionEditorProps['getDefaultSection']) {
    const saved = getSavedHomeSections(userSettings, getDefaultSection);
    return [
        ...saved,
        ...editableHomeSections.filter(section => !saved.includes(section))
    ];
}

export default function HomeSectionEditor({ getDefaultSection, userSettings }: Readonly<HomeSectionEditorProps>) {
    const initialSections = useMemo(() => getSections(userSettings, getDefaultSection), [getDefaultSection, userSettings]);
    const [ sections, setSections ] = useState<Section[]>(initialSections);
    const [ visibleCount, setVisibleCount ] = useState(() => getSavedHomeSections(userSettings, getDefaultSection).length);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const sortable = new Sortable(list, {
            animation: 150,
            chosenClass: 'homeSectionItem-dragging',
            draggable: '.homeSectionItem',
            ghostClass: 'homeSectionItem-ghost',
            handle: '.homeSectionDragHandle',
            onMove: event => {
                list.querySelectorAll('.homeSectionItem-dropBefore, .homeSectionItem-dropAfter').forEach(target => {
                    target.classList.remove('homeSectionItem-dropBefore', 'homeSectionItem-dropAfter');
                });
                if (event.related?.classList.contains('homeSectionItem')) {
                    event.related.classList.add(event.willInsertAfter ? 'homeSectionItem-dropAfter' : 'homeSectionItem-dropBefore');
                }
            },
            onEnd: ({ oldIndex, newIndex }) => {
                list.querySelectorAll('.homeSectionItem-dropBefore, .homeSectionItem-dropAfter').forEach(target => {
                    target.classList.remove('homeSectionItem-dropBefore', 'homeSectionItem-dropAfter');
                });
                if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;

                setSections(current => {
                    const next = [ ...current ];
                    const [ moved ] = next.splice(oldIndex, 1);
                    next.splice(newIndex, 0, moved);
                    return next;
                });
            }
        });

        return () => sortable.destroy();
    }, []);

    const move = useCallback((section: Section, offset: number) => {
        setSections(current => {
            const index = current.indexOf(section);
            const targetIndex = index + offset;
            if (targetIndex < 0 || targetIndex >= current.length) return current;

            const next = [ ...current ];
            const [ moved ] = next.splice(index, 1);
            next.splice(targetIndex, 0, moved);
            return next;
        });
    }, []);

    const toggle = useCallback((section: Section) => {
        const index = sections.indexOf(section);
        const visible = index < visibleCount;
        setSections(current => {
            const next = [ ...current ];
            next.splice(index, 1);
            next.splice(visible ? visibleCount - 1 : visibleCount, 0, section);
            return next;
        });
        setVisibleCount(current => current + (visible ? -1 : 1));
    }, [ sections, visibleCount ]);

    const handleAction = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const section = event.currentTarget.dataset.section as Section;
        switch (event.currentTarget.dataset.action) {
            case 'toggle':
                toggle(section);
                break;
            case 'up':
                move(section, -1);
                break;
            case 'down':
                move(section, 1);
                break;
        }
    }, [ move, toggle ]);

    const savedSections = [
        ...sections.slice(0, visibleCount),
        ...Array(Math.max(0, MAX_HOME_SECTIONS - visibleCount)).fill(HomeSectionType.None)
    ].map((section, index) => ({ id: `home-section-${index}`, section }));

    return (
        <div className='verticalSection homeSectionsEditor'>
            <h2 className='sectionTitle'>{globalize.translate('HomeSections')}</h2>
            <div className='fieldDescription'>{globalize.translate('HomeSectionsHelp')}</div>
            <div className='paperList homeSectionsList' ref={listRef}>
                {sections.map((section, index) => {
                    const visible = index < visibleCount;
                    return (
                        <div
                            className={`listItem homeSectionItem${visible ? '' : ' homeSectionItem-hidden'}`}
                            data-section={section}
                            key={section}
                        >
                            <div className='listItemBody'>{globalize.translate(sectionLabels[section])}</div>
                            <button
                                aria-label={globalize.translate(visible ? 'HideHomeSection' : 'ShowHomeSection')}
                                className='paper-icon-button-light autoSize'
                                data-action='toggle'
                                data-section={section}
                                onClick={handleAction}
                                title={globalize.translate(visible ? 'HideHomeSection' : 'ShowHomeSection')}
                                type='button'
                            >
                                <span aria-hidden='true' className={`material-icons ${visible ? 'visibility' : 'visibility_off'}`} />
                            </button>
                            <button
                                aria-label={globalize.translate('Up')}
                                className='paper-icon-button-light autoSize'
                                data-action='up'
                                data-section={section}
                                disabled={index === 0}
                                onClick={handleAction}
                                title={globalize.translate('Up')}
                                type='button'
                            >
                                <span aria-hidden='true' className='material-icons keyboard_arrow_up' />
                            </button>
                            <button
                                aria-label={globalize.translate('Down')}
                                className='paper-icon-button-light autoSize'
                                data-action='down'
                                data-section={section}
                                disabled={index === sections.length - 1}
                                onClick={handleAction}
                                title={globalize.translate('Down')}
                                type='button'
                            >
                                <span aria-hidden='true' className='material-icons keyboard_arrow_down' />
                            </button>
                            <span aria-label={globalize.translate('DragToReorder')} className='material-icons homeSectionDragHandle' role='img'>drag_handle</span>
                        </div>
                    );
                })}
            </div>
            {savedSections.map(({ id, section }, index) => (
                <input id={`selectHomeSection${index + 1}`} key={id} type='hidden' value={section} readOnly />
            ))}
        </div>
    );
}
