import React, { useMemo } from 'react';
import { Box, Text } from '@forge/react';
import { GitPullRequest } from '../../../types';

type Props = {
    pr: GitPullRequest;
};
export const PullRequest: React.FC<Props> = ({ pr }) => {
    const merged = useMemo(() => pr.merged_at ? (new Date(pr.merged_at)).toLocaleString() : 'No', [pr]);
    return (
        <>
            <Text>
                {pr.title} - {pr.body}
            </Text>
            <Text>Locked: {pr.locked ? 'Yes' : 'No'}</Text>
            <Text>Merged: {merged}</Text>
        </>
    );
};