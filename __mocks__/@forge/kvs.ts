const mockKvs = jest.fn();

export const kvs = {
    getSecret: async (key: string) => mockKvs,
    setSecret: async (key: string, value: any) => mockKvs,
};
export { mockKvs };