import React, { Suspense, useCallback, useMemo } from "react";
import { Box, Spinner } from "@forge/react";
import { BadgeProps, OptionProps } from "@forge/react/out/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeIssueStatusMutation, getIssueOption, getIssueTransitionOption } from "../../queries/options";
import { getIssueKey } from "../../../utils/getIssueKey";
import { IssueItem } from "../shared/IssueItem";
import { GET_ISSUE_TRANSITION_KEY } from "../../queries/keys";
import { useMessage } from "../../hooks";

type Props = {
    title: string;
};

const colorMap: Record<string, BadgeProps['appearance']> = {
    green: 'added',
    yellow: 'primary',
};

export const Issue: React.FC<Props> = React.memo(({ title }) => {
    const qClient = useQueryClient();
    const { showMessage } = useMessage();
    const { data, isLoading } = useQuery(getIssueOption(getIssueKey(title)));
    const { data: transitions } = useQuery({
        ...getIssueTransitionOption(getIssueKey(title)),
        enabled: !isLoading,
        select: (transitions): OptionProps[] => transitions?.map(
            ({ id: value, name: label }) => ({ label, value, defaultSelected: Boolean(value === data?.fields?.status.name as any) })
        )
    });

    const { mutate: changeStatus } = useMutation({
        ...changeIssueStatusMutation(),
        onSuccess: (key) => {
            qClient.invalidateQueries({ queryKey: [GET_ISSUE_TRANSITION_KEY, key] });
            showMessage({ message: 'New status applied', appearance: 'success' });
        },
        onError: (err) => {
            console.warn(err);
            showMessage({ message: 'New status couldn\'t be applied', appearance: 'error' });
        }
    });

    const onChangeStatus = useCallback(({ value }: OptionProps) => {
        if (data?.id) {
            changeStatus({ key: data.id, status: value });
        }
    }, [changeStatus, data?.id]);
    console.log(data);

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
                        issueStatus={data?.fields?.status?.name}
                        iconUrl={data?.fields?.issuetype.iconUrl}
                        summary={data?.fields?.summary}
                        transitionOptions={transitions}
                        onChangeStatus={onChangeStatus}
                    />
                }
            </Box>
        </Suspense>
    );
});