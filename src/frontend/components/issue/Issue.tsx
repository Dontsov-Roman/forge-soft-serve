import React, { Suspense, useMemo } from "react";
import { Text, Badge, Inline, Box, Spinner, Stack, User, Image } from "@forge/react";
import { BadgeProps } from "@forge/react/out/types";
import { useQuery } from "@tanstack/react-query";
import { getIssueOption } from "../../queries/options";
import { getIssueKey } from "../../utils/getIssueKey";

type Props = {
    title: string;
};

const colorMap: Record<string, BadgeProps['appearance']> = {
    green: 'added',
    yellow: 'primary',
};

export const Issue: React.FC<Props> = ({ title }) => {
    const { data, isLoading } = useQuery(getIssueOption(getIssueKey(title)));
    
    const badgeAppearance = useMemo(() => {
        if (!data?.id) return 'removed';
        return data?.fields?.statusCategory?.colorName ? colorMap[data?.fields.statusCategory.colorName] : 'default';
    }, [data]);
    const accountId = useMemo(() => data?.fields?.assignee?.accountId || '', [data]);
    const showSummary = useMemo(() => data?.fields?.issuetype?.name && data?.fields?.summary, [data]);

    return (
        <Suspense fallback={<Spinner size="large" />}>
            <Box padding='space.200' backgroundColor="color.background.accent.yellow.subtler">
                {isLoading && <Spinner size="large" />}
                <Stack space="space.100">
                    <Inline space="space.100">
                        <Text>{data?.key}</Text>
                        <Badge appearance={badgeAppearance}>{data?.fields?.status?.name || 'Ticket not found'}</Badge>
                    </Inline>
                    {showSummary && <Inline space="space.025" alignBlock="start">
                        <Text><Image src={data?.fields?.issuetype.iconUrl || ''} size="xsmall" width={15} /></Text>
                        <Text>{data?.fields?.summary}</Text>
                    </Inline>}
                    {accountId && <Inline alignInline="center" alignBlock="center">
                        <Text>Assignee:</Text>
                        <User accountId={accountId} />
                    </Inline>}
                </Stack>
            </Box>
        </Suspense>
    );
};