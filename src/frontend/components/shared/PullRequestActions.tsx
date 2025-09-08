import React from 'react';
import { LoadingButton, Button, ButtonGroup } from '@forge/react';

type Props = {
    isApproveLoading: boolean;
    isMergeLoading: boolean;
    onApprove: () => void;
    onMerge: () => void;
};

export const PullRequestActions: React.FC<Props> = ({
    isApproveLoading,
    isMergeLoading,
    onApprove,
    onMerge,
}) => {
    return (
        <ButtonGroup>
            <Button
                isDisabled={isApproveLoading}
                appearance='default'
                iconBefore="check-circle-outline"
                onClick={onApprove}
            >
                Approve
            </Button>
            <LoadingButton
                isLoading={isMergeLoading}
                onClick={onMerge}
                appearance='primary'
            >
                Merge
            </LoadingButton>
        </ButtonGroup>
    )
}