import { useCallback, useMemo } from "react";
import { BadgeProps, OptionProps } from "@forge/react/out/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeIssueStatusMutation, getIssueOption, getIssueTransitionOption } from '../queries/options';
import { GET_ISSUE_KEY, GET_ISSUE_TRANSITION_KEY } from "../queries/keys";
import { useMessage } from "../hooks";

const colorMap: Record<string, BadgeProps['appearance']> = {
    green: 'added',
    yellow: 'primary',
};

export const useIssue = (key: string) => {
    const qClient = useQueryClient();
    const { showMessage } = useMessage();
    const { data, isLoading } = useQuery(getIssueOption(key));
    const { data: transitions } = useQuery({
        ...getIssueTransitionOption(key),
        enabled: !isLoading,
        select: (transitions): OptionProps[] => transitions?.map(
            ({ id: value, name: label }) => ({ label, value, defaultSelected: Boolean(label === data?.fields?.status.name as any) })
        )
    });

    const { mutate: changeStatus } = useMutation({
        ...changeIssueStatusMutation(),
        onSuccess: (key) => {
            qClient.invalidateQueries({ queryKey: [GET_ISSUE_TRANSITION_KEY] });
            qClient.invalidateQueries({ queryKey: [GET_ISSUE_KEY] });
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

    const badgeAppearance = useMemo(() => {
        if (!data?.id) return 'removed';
        return data?.fields?.statusCategory?.colorName ? colorMap[data?.fields.statusCategory.colorName] : 'default';
    }, [data]);

    const accountId = useMemo(() => data?.fields?.assignee?.accountId || '', [data]);

    return {
        accountId,
        onChangeStatus,
        transitions,
        badgeAppearance,
        issue: data,
        isLoading,
    };
};