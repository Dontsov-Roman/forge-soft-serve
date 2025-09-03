import React, { Suspense, useMemo } from "react";
import { Text, Badge, Inline } from "@forge/react";
import { useQuery } from "@tanstack/react-query";
import { getIssueOption } from "../../queries/options";
import { getIssueKey } from "../../utils/getIssueKey";

type Props = {
    title: string;
};

const colorMap: Record<string, 'added' | 'default' | 'important' | 'primary' | 'primaryInverted' | 'removed'> = {
    green: 'added',
};

export const Issue: React.FC<Props> = ({ title }) => {
    const { data, isLoading } = useQuery(getIssueOption(getIssueKey(title)));
    const badgeAppearance = useMemo(() => {
        if (!data?.id) return 'removed';
        return data?.fields?.statusCategory?.colorName ? colorMap[data?.fields.statusCategory.colorName] : 'default';
    }, [data]);
    return (
        <Suspense fallback="Issue is loading">
            <Inline>
                <Text>{data?.key}</Text>
                <Badge appearance={badgeAppearance}>{data?.fields?.statusCategory?.name || 'Ticket not found'}</Badge>
            </Inline>
        </Suspense>
    );
};