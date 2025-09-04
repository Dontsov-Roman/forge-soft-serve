import { ID } from "./Base";

type AvatarUrls = {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
};
export type AtlassianUser = {
    accountId: string;
    displayName: string;
    emailAddress: string;
    active: boolean;
    avatarUrls: AvatarUrls;
};

export type AtlassianProject = ID & {
    key: string;
    name: string;
};

export type IssueType = ID & {
    avatarId: number;
    name: string;
    iconUrl: string;
    hierarchyLevel: number;
    description: string;
};

export type IssuePriority = ID & {
    name: string;
};

export type IssueStatusCategory = ID & {
    key: string;
    name: string;
    colorName: string;
};

export type IssueStatus = ID & {
    description: string;
    iconUrl: string;
    name: string;
    statusCategory: IssueStatusCategory
};

export type IssueProgress = {
    progress: number;
    total: number;
};

export type IssueFields = {
    assignee: AtlassianUser;
    creator: AtlassianUser;
    reporter: AtlassianUser;
    issuetype: IssueType;
    priority: IssuePriority;
    status: IssueStatus;
    statusCategory: IssueStatusCategory;
    project: AtlassianProject;
    progress: IssueProgress;
    created: string;
    summary: string;
    key: string;
};

export type Issue = ID & {
    expand: string;
    key: string;
    self: string;
    fields: IssueFields;
};