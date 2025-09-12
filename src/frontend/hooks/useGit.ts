import { useCallback } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { getIssueKey } from "../../utils/getIssueKey";
import { GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY } from "../keys";
import { GetPullRequestPayload, GitPullRequest, PullRequestEventEnum } from "../../types";
import {
    getIssueOption,
} from "../components/issue/queries";
import {
    reviewPullRequestMutation,
    mergePullRequestMutation,
    getPullRequestsOption,
} from "../components/repo/queries"
import { useMessage } from "./useMessage";

export const useGit = (payload: GetPullRequestPayload) => {
    const { showMessage } = useMessage();

    const queryClient = useQueryClient();
    const { data, isPending: prIsLoading } = useQuery(getPullRequestsOption(payload));
    
    useQueries({
        queries: data?.map?.((pr) => getIssueOption(getIssueKey(pr.title))) || [],
    });
    const { mutate: reviewPullRequest, isPending: isApproveLoading } = useMutation({
        ...reviewPullRequestMutation(),
        onSuccess: () => showMessage({ message: 'Pr approved', appearance: 'information' }),
        onError: (err) => showMessage({ message: err.message, appearance: 'discovery' }),
    });

    const { mutate: mergePr, isPending: isMergeLoading } = useMutation({
        ...mergePullRequestMutation(),
        onSuccess: (data, payload) => {
            queryClient.invalidateQueries({ queryKey: [GET_PULL_REQUESTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [GET_ISSUE_KEY] });
            showMessage({ message: data.message, appearance: data.merged ? 'success': 'information' })
        },
    });

    const onMerge = useCallback(async (pr: GitPullRequest) => {
        mergePr({ repo: pr.base.repo.name, owner: pr.base.repo.owner.login, pull_number: pr.number, title: pr.title });
    }, [mergePr]);

    const onApprove = useCallback(async (pr: GitPullRequest) => {
        reviewPullRequest({
            repo: pr.base.repo.name,
            owner: pr.base.repo.owner.login,
            pull_number: pr.number,
            event: PullRequestEventEnum.APPROVE,
        });
    }, [reviewPullRequest]);

    return {
        onMerge,
        onApprove,
        showSpinner: prIsLoading,
        isApproveLoading,
        data,
        isMergeLoading,
    };
};