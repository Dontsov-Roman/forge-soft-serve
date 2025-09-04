import { useCallback, useMemo, useState } from "react";
import { useSimpleTimeout } from "./useSimpleTimeout";
import { getIssueKey } from "../utils/getIssueKey";
import { getIssueOption, getPullRequestsOption, mergePullRequestMutation, moveIssueToDoneMutation } from "../queries/options";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY } from "../queries/keys";
import { GetPullRequestPayload, GitPullRequest } from "../../types";

export const useMerge = (payload: GetPullRequestPayload) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const { enabled: showSuccessMessage, onClick: toggleSuccessMessage } = useSimpleTimeout();
    const { data, isPending: prIsLoading } = useQuery(getPullRequestsOption(payload));
    
    useQueries({
        queries: data?.map((pr) => getIssueOption(getIssueKey(pr.title))) || [],
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
            toggleSuccessMessage();
        },
    });

    const onMerge = useCallback(async (pr: GitPullRequest) => {
        mergePr({ repo: pr.base.repo.name, owner: pr.base.repo.owner.login, pull_number: pr.number, title: pr.title });
    }, [mergePr, closeIssue]);

    return {
        onMerge,
        setModalOpen,
        showSpinner: prIsLoading,
        data,
        mergeInProgress,
        showSuccessMessage,
        isModalOpen,
    };

};