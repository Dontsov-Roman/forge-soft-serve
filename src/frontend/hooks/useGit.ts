import { useCallback, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSimpleTimeout } from "./useSimpleTimeout";
import { getIssueKey } from "../utils/getIssueKey";
import { GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY } from "../queries/keys";
import { GetPullRequestPayload, GitPullRequest, PullRequestEventEnum } from "../../types";
import {
    getIssueOption,
    getPullRequestsOption,
    mergePullRequestMutation,
    moveIssueToDoneMutation,
    reviewPullRequestMutation,
} from "../queries/options";
import { useMessage } from "../components/messages/MessageContext";

export const useGit = (payload: GetPullRequestPayload) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { showMessage } = useMessage();

    const queryClient = useQueryClient();
    const { enabled: showSuccessMessage, onClick: toggleSuccessMessage } = useSimpleTimeout();
    const { data, isPending: prIsLoading } = useQuery(getPullRequestsOption(payload));
    
    useQueries({
        queries: data?.map((pr) => getIssueOption(getIssueKey(pr.title))) || [],
    });
    const { mutate: reviewPullRequest } = useMutation({
        ...reviewPullRequestMutation(),
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
            closeIssue(getIssueKey(payload.title));
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
        data,
        mergeInProgress,
        showSuccessMessage,
        isModalOpen,
    };

};