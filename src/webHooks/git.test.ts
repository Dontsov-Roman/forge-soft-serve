import { mockRequestJira } from '@forge/api';
import { mockOctokitVerify } from '@octokit/webhooks';
import { GIT_HEADERS as headers, WEBHOOK, MOCKED_ISSUE_TRANSITION } from 'mock-data';
import { gitMergeHook } from './git';
import { RESPONSE } from './response';

describe('Git Web Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Parse error', async () => {
        const result = await gitMergeHook({ headers, body: `${JSON.stringify(WEBHOOK)} error string` });
        expect(result).toBe(RESPONSE.PARSE_ERROR);
    });
    
    it('Action event error', async () => {
        const result = await gitMergeHook({ headers, body: JSON.stringify({ ...WEBHOOK, action: 'open' }) });
        expect(result).toBe(RESPONSE.BAD_REQUEST);
    });

    it('Signature check error', async () => {
        mockOctokitVerify.mockResolvedValueOnce(false);
        const result = await gitMergeHook({ headers, body: JSON.stringify(WEBHOOK) });
        expect(result).toBe(RESPONSE.SIGNATURE_FAILED);
    });

    
    it('Move to done error', async () => {
        mockOctokitVerify.mockResolvedValueOnce(true);
        await mockRequestJira.mockResolvedValue({
            json: async () => ({ transitions: [{ ...MOCKED_ISSUE_TRANSITION, name: 'Bad name', to: { name: 'bad name' } }] })
        });

        const result = await gitMergeHook({ headers, body: JSON.stringify(WEBHOOK) });

        expect(result).toBe(RESPONSE.NOT_FOUND);
    });

    it('Success', async () => {
        mockOctokitVerify.mockResolvedValueOnce(true);
        await mockRequestJira.mockResolvedValue({
            json: async () => ({ transitions: [MOCKED_ISSUE_TRANSITION] }),
            ok: true,
        });
        
        const result = await gitMergeHook({ headers, body: JSON.stringify(WEBHOOK) });

        expect(result).toBe(RESPONSE.OK);
    });
});