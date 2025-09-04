import React, { Suspense, useMemo } from "react";
import { Text, Badge, Inline, Box, Spinner, Stack } from "@forge/react";
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

    return (
        <Suspense fallback={<Spinner size="large" />}>
            <Box padding='space.200' backgroundColor="color.background.accent.yellow.subtler">
                {isLoading && <Spinner size="large" />}
                <Stack space="space.200">
                    <Inline
                        space="space.100"
                    >
                        <Text>{data?.key}</Text>
                        <Badge appearance={badgeAppearance}>{data?.fields?.status?.name || 'Ticket not found'}</Badge>
                    </Inline>
                    <Text>{data?.fields.issuetype?.name}</Text>
                    <Text>{data?.fields.summary}</Text>
                    <Text>Assignee: {data?.fields.assignee.displayName}</Text>
                </Stack>
            </Box>
        </Suspense>
    );
};