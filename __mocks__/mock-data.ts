import {
    GitHook,
    GitLabel,
    GitPullRequest,
    GitRepository,
    GitUser,
    MergePullRequestResponse,
} from '../types';

export const MOCKED_GIT_USER: GitUser = {
    id: 1,
    avatar_url: 'string',
    login: 'string'
};

export const MOCKED_GIT_LABEL: GitLabel = {
    id: 1,
    name: 'name',
    color: 'color',
    default: true,
};

export const MOCKED_REPO: GitRepository = {
    id: 1,
    name: 'string',
    full_name: 'string',
    disabled: false,
    commits_url: 'string',
    pulls_url: 'string',
    language: 'string',
    description: 'string',
    updated_at: 'string',
    html_url: 'string',
    owner: MOCKED_GIT_USER,
};

export const MOCKED_PR: GitPullRequest = {
    id: 1,
    url: 'string',
    html_url: 'string',
    number: 1,
    state: 'string',
    locked: false,
    merged_at: 'string',
    created_at: 'string',
    updated_at: 'string',
    title: 'SOF-1',
    user: MOCKED_GIT_USER,
    body: 'string',
    labels: [MOCKED_GIT_LABEL],
    base: {
        repo: MOCKED_REPO,
        label: 'string',
        ref: 'string',
    }
};

export const MOCKED_MERGE_RESPONSE: MergePullRequestResponse = {
    message: 'Merged',
    merged: true,
    sha: 'sha',
};

export const MOCKED_ISSUE = {
    id: 1,
    expand: 'string',
    key: 'string'
};

export const MOCKED_ISSUE_TRANSITION = {
    id: 1,
    expand: 'string',
    key: 'string',
    name: 'Done',
    isAvailable: true,
    to: { name: 'Done' }
};

export const WEBHOOK: GitHook = {
    action: 'closed',
    number: 1,
    pull_request: MOCKED_PR,
};

export const GIT_HEADERS = {
    'x-hub-signature-256': ['some mocked signature'],
};