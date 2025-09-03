import React, { Suspense } from 'react';
import { Text } from '@forge/react';
import { useQuery } from '@tanstack/react-query';
import { getPullRequestsOption } from '../../queries/options';
import { GetPullRequestPayload } from '../../../types';

type Props = {
    payload: GetPullRequestPayload;
};

export const PullRequestList: React.FC<Props> = ({ payload }) => {
    const { data } = useQuery(getPullRequestsOption(payload));

    return (
        <Suspense fallback="Loading Pull Requests">
            {data?.length ? data.map((pr) => (
                <Text key={pr.id}>
                    <Text>
                        {pr.title} - {pr.body}
                    </Text>
                    <Text>Locked: {pr.locked ? 'Yes' : 'No'}</Text>
                    <Text>Merged: {pr.merged_at ? (new Date(pr.merged_at)).toLocaleString() : 'No'}</Text>
                </Text>
                )
            ) : <Text>No Pull Requests</Text>}
        </Suspense>
    );
};