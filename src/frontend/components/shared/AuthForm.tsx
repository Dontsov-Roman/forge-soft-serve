import React from 'react';
import { AuthPayload } from '../../../types';
import {
    LoadingButton as Button,
    Form,
    FormFooter,
    FormHeader,
    FormSection,
    Label,
    RequiredAsterisk,
    Textfield,
    useForm,
} from '@forge/react';

type Props = {
    isLoading: boolean;
    onSubmit: (payload: AuthPayload) => Promise<any>;
};
export const AuthForm: React.FC<Props> = ({ isLoading, onSubmit }) => {
    const { getFieldId, register, handleSubmit } = useForm<AuthPayload>();
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                <Button
                    isLoading={isLoading}
                    appearance="primary"
                    type="submit"
                >
                    Submit
                </Button>
            </FormFooter>
        </Form>  
    );
};