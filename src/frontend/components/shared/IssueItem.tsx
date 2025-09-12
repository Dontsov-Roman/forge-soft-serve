import React, { useMemo } from "react";
import { Text, Badge, Inline, Stack, User, Image, Select, Box } from "@forge/react";
import { BadgeProps } from "@forge/react/out/types";
import { OptionProps } from "@forge/react/out/types";

type Props = {
    issueKey?: string;
    badgeAppearance?: BadgeProps['appearance'];
    accountId?: string;
    summary?: string;
    iconUrl?: string;
    issueStatus?: string;
    onChangeStatus?: (newStatus: OptionProps) => void;
    transitionOptions?: OptionProps[];
};

export const IssueItem: React.FC<Props> = ({
    issueKey = '',
    accountId = '',
    summary = '',
    iconUrl = '',
    badgeAppearance = 'default',
    issueStatus = 'Ticket not found',
    onChangeStatus,
    transitionOptions = [],
}) => {
    const showSummary = useMemo(() => Boolean(iconUrl && summary), [iconUrl, summary]);
    const defaultValue = useMemo(() => transitionOptions.find((t) => t.defaultSelected), [transitionOptions])
    return (
        <Stack space="space.100">
            <Inline space="space.100" alignBlock="center">
                <Box><Text>{issueKey}</Text></Box>
                <Box><Badge appearance={badgeAppearance}>{issueStatus}</Badge></Box>
            </Inline>
            {
                onChangeStatus &&
                transitionOptions.length ?
                    <Select
                        onChange={onChangeStatus}
                        placeholder="New status"
                        options={transitionOptions}
                        defaultValue={defaultValue}
                    /> : null
            }
            {
                showSummary &&
                <Inline space="space.100" alignBlock="center" alignInline="start">
                    <Box><Image src={iconUrl || ''} size="xsmall" width="15px" /></Box>
                    <Box><Text size="small">{summary}</Text></Box>
                </Inline>
            }
            {
                accountId &&
                <Inline alignInline="center" alignBlock="center">
                    <Text>Assignee:</Text>
                    <User accountId={accountId} />
                </Inline>
            }
        </Stack>
    );
};