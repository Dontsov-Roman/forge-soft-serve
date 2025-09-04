import React, { useMemo } from 'react';
import { Icon, Inline, Link, Stack, Tag, TagGroup, Text } from '@forge/react';
import { GitPullRequest } from '../../../types';
import { TagColor } from '@forge/react/out/types';
import { Avatar } from './Avatar';

type Props = {
    pr: GitPullRequest;
};

const TAGS_COLOR_MAP: Record<string, TagColor> = {
    'd73a4a': 'red',
    '0075ca': 'blue',
    'cfd3d7': 'yellow',
    'a2eeef': 'blue',
    '7057ff': 'yellow',
    '008672': 'teal',
    'e4e669': 'red',
    'd876e3': 'purple',
    'ffffff': 'grey',
};

export const PullRequest: React.FC<Props> = ({ pr }) => {
    const merged = useMemo(() => pr.merged_at ? (new Date(pr.merged_at)).toLocaleString() : 'No', [pr.merged_at]);
    const createdAt = useMemo(() => (new Date(pr.created_at)).toLocaleString(), [pr.created_at]);
    const updatedAt = useMemo(() => (new Date(pr.updated_at)).toLocaleString(), [pr.updated_at]);

    return (
        <Stack space='space.025'>
            <Link href={pr.html_url}>
                <Text>{pr.title}</Text>
            </Link>
            <Text>{pr.body}</Text>
            <Inline alignBlock='center' space='space.100'>
                <Text>Author:</Text>
                <Avatar size='xsmall' url={pr.user.avatar_url} name={pr.user.login} />
            </Inline>
            <Text>Created at: {createdAt}</Text>
            <Text>Last Update: {updatedAt}</Text>
            {pr.locked &&
                <Inline alignBlock='start'>
                    <Text>Locked:</Text>
                    <Icon glyph='close' label='No' />
                </Inline>
            }
            <Text>Merged: {merged}</Text>
            <TagGroup>
                {pr.labels?.map((label) => (
                    <Tag
                        key={label.name}
                        text={label.name}
                        color={TAGS_COLOR_MAP[label.color] as any}
                    />
                ))}
            </TagGroup>
        </Stack>
    );
};