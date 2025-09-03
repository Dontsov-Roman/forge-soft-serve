import React from "react";
import { Text } from '@forge/react';
import { GitRepository } from "../../types";

type Props = {
    repo: GitRepository;
}
export const RepoItem: React.FC<Props> = ({ repo: { name, owner } }) => {
    return (
        <>
            <Text>Title: {name}</Text>
            <Text>Owner: {owner.login}</Text>
        </>
    );
}