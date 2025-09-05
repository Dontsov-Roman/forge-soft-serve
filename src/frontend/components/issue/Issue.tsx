import React, { Suspense, useMemo } from "react";
import { Box, Spinner } from "@forge/react";
import { BadgeProps } from "@forge/react/out/types";
import { useQuery } from "@tanstack/react-query";
import { getIssueOption } from "../../queries/options";
import { getIssueKey } from "../../utils/getIssueKey";
import { IssueItem } from "../shared/IssueItem";

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

    return (
        <Suspense fallback={<Spinner size="large" />}>
            <Box padding='space.200' backgroundColor="color.background.accent.yellow.subtler">
                {isLoading ?
                    <Spinner size="large" /> :
                    <IssueItem
                        accountId={accountId}
                        issueKey={data?.key}
                        badgeAppearance={badgeAppearance}
                        issueType={data?.fields?.status?.name}
                        iconUrl={data?.fields?.issuetype.iconUrl}
                        summary={data?.fields?.summary}
                    />
                }
            </Box>
        </Suspense>
    );
};