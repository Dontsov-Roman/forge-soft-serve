import React from "react";
import { Box, Text } from '@forge/react';
import { GitRepository } from "../../../types";

type Props = {
    repo: GitRepository;
}
export const RepoItem: React.FC<Props> = ({ repo: { name, owner, disabled, language } }) => (
    <Box backgroundColor="color.background.accent.lime.subtlest">
        <Text>Title: {name}</Text>
        <Text>Owner: {owner.login}</Text>
        <Text>Disabled: {disabled ? 'Yes' : 'No'}</Text>
        {language && <Text>Language: {language}</Text>}
    </Box>
);