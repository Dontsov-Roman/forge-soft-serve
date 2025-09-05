import { ID } from './Base';
import { IssueStatusCategory } from './Issue';

type TransitionSummary = {
    allowedValues: string[];
    defaultValue: string;
    hasDefaultValue: boolean;
    key: string;
    name: string;
    operations: string[];
    required: boolean;
};

type TargetTransition = ID & {
    description: string;
    iconUrl: string;
    name: string;
    self: string;
    statusCategory: IssueStatusCategory;
};

export type IssueTransition = ID & {
    fields: {
        summary: TransitionSummary;
    },
    hasScreen: boolean;
    isAvailable: boolean,
    isConditional: boolean;
    isGlobal: boolean;
    isInitial: boolean;
    name: string;
    to: TargetTransition;
};