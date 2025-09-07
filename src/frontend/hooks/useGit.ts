import { useCallback, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { getIssueKey } from "../../utils/getIssueKey";
import { GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY } from "../keys";
import { GetPullRequestPayload, GitPullRequest, PullRequestEventEnum } from "../../types";
import {
    getIssueOption,
    moveIssueToDoneMutation,
} from "../components/issue/queries";
import {
    reviewPullRequestMutation,
    mergePullRequestMutation,
    getPullRequestsOption,
} from "../components/repo/queries"
import { useMessage } from "./useMessage";

export const useGit = (payload: GetPullRequestPayload) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { showMessage } = useMessage();

    const queryClient = useQueryClient();
    const { data, isPending: prIsLoading } = useQuery(getPullRequestsOption(payload));
    
    useQueries({
        queries: data?.map?.((pr) => getIssueOption(getIssueKey(pr.title))) || [],
    });
    const { mutate: reviewPullRequest, isPending: isAprrovePending } = useMutation({
        ...reviewPullRequestMutation(),
        onSuccess: () => showMessage({ message: 'Pr approved', appearance: 'information' }),
        onError: (err) => showMessage({ message: err.message, appearance: 'error' }),
    });

    const { mutate: closeIssue } = useMutation({
        ...moveIssueToDoneMutation(),
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: [GET_ISSUE_KEY, id] });
        },
    });
    
    const { mutate: mergePr, isPending: mergeInProgress } = useMutation({
        ...mergePullRequestMutation(),
        onSuccess: (data, payload) => {
            // closeIssue(getIssueKey(payload.title));
            console.log(data);
            queryClient.invalidateQueries({ queryKey: [GET_PULL_REQUESTS_KEY] });
            showMessage({ message: 'PR merged succesfully', appearance: 'success' })
        },
    });

    const onMerge = useCallback(async (pr: GitPullRequest) => {
        mergePr({ repo: pr.base.repo.name, owner: pr.base.repo.owner.login, pull_number: pr.number, title: pr.title });
    }, [mergePr, closeIssue]);

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
        setModalOpen,
        showSpinner: prIsLoading,
        isAprrovePending,
        data,
        mergeInProgress,
        isModalOpen,
    };
};