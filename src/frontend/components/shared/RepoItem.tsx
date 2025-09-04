import React from "react";
import { Box, Inline, Link, Text } from '@forge/react';
import { GitRepository } from "../../../types";
import { Avatar } from "./Avatar";

type Props = {
    repo: GitRepository;
}
export const RepoItem: React.FC<Props> = ({ repo: { name, description, owner, html_url, disabled, language } }) => (
    <Box padding="space.200" backgroundColor="color.background.accent.lime.subtlest">
        <Link href={html_url}><Text>{name}</Text></Link>
        <Text>Description: {description}</Text>
        <Inline space="space.100" alignBlock="center">
            <Text>Owner: </Text>
            <Avatar size="medium" url={owner.avatar_url} name={owner.login} /> 
        </Inline>
        <Text>Disabled: {disabled ? 'Yes' : 'No'}</Text>
        {language && <Text>Language: {language}</Text>}
    </Box>
);