import React, { Suspense } from "react";
import { Box, Spinner } from "@forge/react";
import { BadgeProps } from "@forge/react/out/types";
import { getIssueKey } from "../../../utils/getIssueKey";
import { IssueItem } from "../shared/IssueItem";
import { useIssue } from "../../hooks/useIssue";

type Props = {
    title: string;
};

export const Issue: React.FC<Props> = React.memo(({ title }) => {
    const {
        onChangeStatus,
        transitions,
        accountId,
        isLoading,
        issue,
        badgeAppearance,
    } = useIssue(getIssueKey(title));
    return (
        <Suspense fallback={<Spinner size="large" />}>
            <Box padding='space.200' backgroundColor="color.background.accent.yellow.subtler">
                {isLoading ?
                    <Spinner size="large" /> :
                    <IssueItem
                        accountId={accountId}
                        issueKey={issue?.key}
                        badgeAppearance={badgeAppearance}
                        issueStatus={issue?.fields?.status?.name}
                        iconUrl={issue?.fields?.issuetype.iconUrl}
                        summary={issue?.fields?.summary}
                        transitionOptions={transitions}
                        onChangeStatus={onChangeStatus}
                    />
                }
            </Box>
        </Suspense>
    );
});