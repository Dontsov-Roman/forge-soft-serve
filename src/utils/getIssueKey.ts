export const getIssueKey = (title: string): string => {
    const regex = /\b[A-Z]{2,}-\d+\b/;
    const match = title.match(regex);
    return match ? match[0] : '';
};