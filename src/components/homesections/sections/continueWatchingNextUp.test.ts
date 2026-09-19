import { describe, expect, it } from 'vitest';

import { combineContinueWatchingAndNextUp } from './continueWatchingNextUp';

describe('combineContinueWatchingAndNextUp', () => {
    it('keeps resume items first and removes duplicate items', () => {
        expect(combineContinueWatchingAndNextUp(
            [{ Id: 'resume' }, { Id: 'shared' }],
            [{ Id: 'shared' }, { Id: 'next-up' }]
        ).map(item => item.Id)).toEqual(['resume', 'shared', 'next-up']);
    });
});
