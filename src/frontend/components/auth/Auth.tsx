import React from 'react';
import { Box } from '@forge/react';
import { AuthPayload } from '../../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authMutation } from '../../queries/options';
import { GET_ISSUE_KEY, GET_ISSUE_TRANSITION_KEY, GET_PULL_REQUESTS_KEY, GET_REPOSITORIES_KEY } from '../../queries/keys';
import { useMessage } from "../../hooks";
import { AuthForm } from '../shared/AuthForm';

export const Auth: React.FC = () => {
    const qClient = useQueryClient();
    const { showMessage } = useMessage();

    const { mutate: setToken, isPending } = useMutation({
        ...authMutation(),
        onSuccess: () => {
            showMessage({ message: 'Token has been applied', appearance: 'success' });
            qClient.invalidateQueries({
                queryKey: [GET_REPOSITORIES_KEY, GET_ISSUE_KEY, GET_PULL_REQUESTS_KEY, GET_ISSUE_TRANSITION_KEY]
            });
        },
    });
    
    return (
        <Box>
            <AuthForm onSubmit={setToken as (payload: AuthPayload) => Promise<boolean>} isLoading={isPending} />
        </Box>
    );
};