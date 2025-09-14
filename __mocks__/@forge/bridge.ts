const mockRequestJira = jest.fn();

export default {
    requestJira: mockRequestJira,
};

export const route = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
  
export { mockRequestJira };
