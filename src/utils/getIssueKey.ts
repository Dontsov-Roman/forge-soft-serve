export const getIssueKey = (title: string): string => {
    const [key] = title.split(':');
    return key;
};