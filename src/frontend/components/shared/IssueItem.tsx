import React, { useMemo } from "react";
import { Text, Badge, Inline, Stack, User, Image } from "@forge/react";
import { BadgeProps } from "@forge/react/out/types";

type Props = {
    issueKey?: string;
    badgeAppearance?: BadgeProps['appearance'];
    accountId?: string;
    summary?: string;
    iconUrl?: string;
    issueType?: string;
};

export const IssueItem: React.FC<Props> = ({
    issueKey = '',
    accountId = '',
    summary = '',
    iconUrl = '',
    badgeAppearance = 'default',
    issueType = 'Ticket not found',
}) => {
    const showSummary = useMemo(() => Boolean(iconUrl && summary), [iconUrl, summary]);
    return (
        <Stack space="space.100">
            <Inline space="space.100">
                <Text>{issueKey}</Text>
                <Badge appearance={badgeAppearance}>{issueType}</Badge>
            </Inline>
            {showSummary && <Inline space="space.025" alignBlock="start">
                <Text><Image src={iconUrl || ''} size="xsmall" width={15} /></Text>
                <Text>{summary}</Text>
            </Inline>}
            {accountId && <Inline alignInline="center" alignBlock="center">
                <Text>Assignee:</Text>
                <User accountId={accountId} />
            </Inline>}
        </Stack>
    );
};