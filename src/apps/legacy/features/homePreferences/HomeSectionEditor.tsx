import Sortable from 'sortablejs';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { HomeSectionType } from 'constants/homeSectionType';
import globalize from 'lib/globalize';

import './HomeSectionEditor.scss';

const MAX_HOME_SECTIONS = 10;

const availableSections = [
    HomeSectionType.SmallLibraryTiles,
    HomeSectionType.LibraryButtons,
    HomeSectionType.ActiveRecordings,
    HomeSectionType.Resume,
    HomeSectionType.ResumeAudio,
    HomeSectionType.ResumeBook,
    HomeSectionType.LatestMedia,
    HomeSectionType.NextUp,
    HomeSectionType.LiveTv
] as const;

type Section = typeof availableSections[number];

interface UserSettings {
    get: (name: string) => string | null | undefined;
}

interface HomeSectionEditorProps {
    getDefaultSection: (index: number) => HomeSectionType;
    userSettings: UserSettings;
}

const sectionLabels: Record<Section, string> = {
    [HomeSectionType.SmallLibraryTiles]: 'HeaderMyMedia',
    [HomeSectionType.LibraryButtons]: 'HeaderMyMediaSmall',
    [HomeSectionType.ActiveRecordings]: 'HeaderActiveRecordings',
    [HomeSectionType.Resume]: 'HeaderContinueWatching',
    [HomeSectionType.ResumeAudio]: 'HeaderContinueListening',
    [HomeSectionType.ResumeBook]: 'HeaderContinueReading',
    [HomeSectionType.LatestMedia]: 'HeaderLatestMedia',
    [HomeSectionType.NextUp]: 'NextUp',
    [HomeSectionType.LiveTv]: 'LiveTV'
};

function isSection(value: string | null | undefined): value is Section {
    return availableSections.includes(value as Section);
}

function getSavedSections(userSettings: UserSettings, getDefaultSection: HomeSectionEditorProps['getDefaultSection']) {
    return Array.from({ length: MAX_HOME_SECTIONS }, (_, index) => (
        userSettings.get(`homesection${index}`) || getDefaultSection(index)
    )).filter(isSection);
}

function getSections(userSettings: UserSettings, getDefaultSection: HomeSectionEditorProps['getDefaultSection']) {
    const saved = getSavedSections(userSettings, getDefaultSection);
    return [
        ...saved,
        ...availableSections.filter(section => !saved.includes(section))
    ];
}

export default function HomeSectionEditor({ getDefaultSection, userSettings }: Readonly<HomeSectionEditorProps>) {
    const initialSections = useMemo(() => getSections(userSettings, getDefaultSection), [getDefaultSection, userSettings]);
    const [ sections, setSections ] = useState<Section[]>(initialSections);
    const [ visibleCount, setVisibleCount ] = useState(() => getSavedSections(userSettings, getDefaultSection).length);
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

    const move = (section: Section, offset: number) => {
        setSections(current => {
            const index = current.indexOf(section);
            const targetIndex = index + offset;
            if (targetIndex < 0 || targetIndex >= current.length) return current;

            const next = [ ...current ];
            const [ moved ] = next.splice(index, 1);
            next.splice(targetIndex, 0, moved);
            return next;
        });
    };

    const toggle = (section: Section) => {
        const index = sections.indexOf(section);
        const visible = index < visibleCount;
        setSections(current => {
            const next = [ ...current ];
            next.splice(index, 1);
            next.splice(visible ? visibleCount - 1 : visibleCount, 0, section);
            return next;
        });
        setVisibleCount(current => current + (visible ? -1 : 1));
    };

    const savedSections = [
        ...sections.slice(0, visibleCount),
        ...Array(Math.max(0, MAX_HOME_SECTIONS - visibleCount)).fill(HomeSectionType.None)
    ];

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
                                onClick={() => toggle(section)}
                                title={globalize.translate(visible ? 'HideHomeSection' : 'ShowHomeSection')}
                                type='button'
                            >
                                <span aria-hidden='true' className={`material-icons ${visible ? 'visibility' : 'visibility_off'}`} />
                            </button>
                            <button
                                aria-label={globalize.translate('Up')}
                                className='paper-icon-button-light autoSize'
                                disabled={index === 0}
                                onClick={() => move(section, -1)}
                                title={globalize.translate('Up')}
                                type='button'
                            >
                                <span aria-hidden='true' className='material-icons keyboard_arrow_up' />
                            </button>
                            <button
                                aria-label={globalize.translate('Down')}
                                className='paper-icon-button-light autoSize'
                                disabled={index === sections.length - 1}
                                onClick={() => move(section, 1)}
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
            {savedSections.map((section, index) => (
                <input id={`selectHomeSection${index + 1}`} key={index} type='hidden' value={section} readOnly />
            ))}
        </div>
    );
}
