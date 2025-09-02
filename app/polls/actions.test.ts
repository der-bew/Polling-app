import { createPoll, vote } from './actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: jest.fn(),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const createSupabaseServerClientMock = createSupabaseServerClient as jest.Mock;

describe('Poll Actions', () => {
  let supabaseMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    supabaseMock = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'poll-123' }, error: null }),
      eq: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };
    createSupabaseServerClientMock.mockReturnValue(supabaseMock);
  });

  describe('createPoll', () => {
    it('should return an error if user is not logged in', async () => {
      supabaseMock.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const result = await createPoll('Test Question', ['Option 1', 'Option 2']);
      expect(result).toEqual({ error: 'You must be logged in to create a poll.' });
    });

    it('should return an error if question is empty', async () => {
      const result = await createPoll(' ', ['Option 1', 'Option 2']);
      expect(result).toEqual({ error: 'Question cannot be empty.' });
    });

    it('should return an error if there are less than two options', async () => {
      const result = await createPoll('Test Question', ['Option 1']);
      expect(result).toEqual({ error: 'You must provide at least two options.' });
    });

    it('should create a poll and redirect on success', async () => {
      const insertPollMock = jest.fn().mockReturnThis();
      const selectPollMock = jest.fn().mockReturnThis();
      const singlePollMock = jest.fn().mockResolvedValue({ data: { id: 'poll-123' }, error: null });

      const insertOptionsMock = jest.fn().mockResolvedValue({ error: null });

      supabaseMock.from.mockImplementation((table: string) => {
        if (table === 'polls') {
          return {
            insert: insertPollMock,
            select: selectPollMock,
            single: singlePollMock,
          };
        }
        if (table === 'options') {
          return {
            insert: insertOptionsMock,
          };
        }
        return supabaseMock;
      });

      await createPoll('Test Question', ['Option 1', 'Option 2']);

      expect(supabaseMock.from).toHaveBeenCalledWith('polls');
      expect(insertPollMock).toHaveBeenCalledWith([{ question: 'Test Question', created_by: 'user-123' }]);
      expect(supabaseMock.from).toHaveBeenCalledWith('options');
      expect(insertOptionsMock).toHaveBeenCalledWith([
        { text: 'Option 1', poll_id: 'poll-123' },
        { text: 'Option 2', poll_id: 'poll-123' },
      ]);
      expect(revalidatePath).toHaveBeenCalledWith('/polls');
      expect(redirect).toHaveBeenCalledWith('/polls/poll-123');
    });

    it('should return an error if poll creation fails', async () => {
        supabaseMock.from.mockImplementation((table: string) => {
            if (table === 'polls') {
              return {
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: { message: 'db error' } }),
              };
            }
            return supabaseMock;
        });

        const result = await createPoll('Test Question', ['Option 1', 'Option 2']);
        expect(result).toEqual({ error: 'Error creating the poll.' });
    });

    it('should cleanup poll if options creation fails', async () => {
        const deleteMock = jest.fn().mockReturnThis();
        const eqMock = jest.fn().mockResolvedValue({ error: null });
        supabaseMock.from.mockImplementation((table: string) => {
            if (table === 'polls') {
              return {
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: { id: 'poll-123' }, error: null }),
                delete: deleteMock,
                eq: eqMock,
              };
            }
            if (table === 'options') {
              return {
                insert: jest.fn().mockResolvedValue({ error: { message: 'db error' } }),
              };
            }
            return supabaseMock;
        });
        
        const result = await createPoll('Test Question', ['Option 1', 'Option 2']);

        expect(result).toEqual({ error: 'Error creating the options.' });
        expect(supabaseMock.from).toHaveBeenCalledWith('polls');
        expect(deleteMock).toHaveBeenCalled();
        expect(eqMock).toHaveBeenCalledWith('id', 'poll-123');
    });
  });

  describe('vote', () => {
    it('should return an error if user is not logged in', async () => {
      supabaseMock.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const result = await vote('poll-123', 'option-123');
      expect(result).toEqual({ error: 'You must be logged in to vote.' });
    });

    it('should return an error if user has already voted', async () => {
      supabaseMock.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'vote-123' }, error: null }),
      });

      const result = await vote('poll-123', 'option-123');
      expect(result).toEqual({ error: 'You have already voted on this poll.' });
    });

    it('should return an error when checking for existing vote fails', async () => {
        supabaseMock.from.mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'db error', code: 'SOME_CODE' } }),
        });
  
        const result = await vote('poll-123', 'option-123');
        expect(result).toEqual({ error: 'Error checking for existing votes.' });
    });

    it('should submit a vote and return success', async () => {
      supabaseMock.from.mockImplementation((table: string) => {
        if (table === 'votes') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }), // No rows found
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return supabaseMock;
      });

      const result = await vote('poll-123', 'option-123');

      expect(supabaseMock.from).toHaveBeenCalledWith('votes');
      expect(revalidatePath).toHaveBeenCalledWith('/polls/poll-123');
      expect(result).toEqual({ success: true });
    });

    it('should return an error if vote submission fails', async () => {
        supabaseMock.from.mockImplementation((table: string) => {
            if (table === 'votes') {
              return {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }), // No rows found
                insert: jest.fn().mockResolvedValue({ error: { message: 'db error' } }),
              };
            }
            return supabaseMock;
          });
    
          const result = await vote('poll-123', 'option-123');
          expect(result).toEqual({ error: 'Error submitting your vote.' });
    });
  });
});
