import React from 'react';
import { Box, LoadingButton as Button, Form, FormFooter, FormHeader, FormSection, Label, RequiredAsterisk, Textfield, useForm } from '@forge/react';
import { AuthPayload } from '../../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authMutation } from '../../queries/options';
import { GET_ISSUE_KEY, GET_ISSUE_TRANSITION_KEY, GET_PULL_REQUESTS_KEY, GET_REPOSITORIES_KEY } from '../../queries/keys';
import { useMessage } from "../../hooks";

type Props = {};

export const Auth: React.FC<Props> = () => {
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
    
    const { handleSubmit, getFieldId, register } = useForm<AuthPayload>();

    return (
        <Box>
            <Form onSubmit={handleSubmit(setToken as any)}>
                <FormHeader title="Login">
                    Enter GitHub token
                </FormHeader>
                <FormSection>
                    <Label labelFor={getFieldId("token")}>
                        Token
                        <RequiredAsterisk />
                    </Label>
                    <Textfield {...register('token', { required: true })} />
                </FormSection>
                <FormFooter>
                    <Button isLoading={isPending} appearance="primary" type="submit">Submit</Button>
                </FormFooter>
            </Form>
        </Box>
    );
};