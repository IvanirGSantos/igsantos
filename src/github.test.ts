import { describe, it, expect, jest } from '@jest/globals';
import { findMeow, insertMeow } from './github';

const mockOctokit = {
  paginate: jest.fn(),
  issues: {
    listComments: jest.fn(),
    createComment: jest.fn(),
    updateComment: jest.fn()
  }
};

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => mockOctokit)
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Write comment', () => {
  it('should write a new comment with "meow"', async () => {
    mockOctokit.issues.createComment = jest.fn().mockImplementation(() => {
      return { data: { id: 1 } };
    });

    await insertMeow('owner', 'repo', 1, '__invalid_token__', 'catImageUrl');

    expect(mockOctokit.issues.createComment).toHaveBeenCalled();
  });

  it('should update a comment with "meow"', async () => {
    mockOctokit.issues.updateComment = jest.fn().mockImplementation(() => {
      return { data: { id: 1 } };
    });

    await insertMeow('owner', 'repo', 1, '__invalid_token__', 'catImageUrl', 1);
    expect(mockOctokit.issues.updateComment).toHaveBeenCalled();
  });
});

describe('Comment finder', () => {
  it('should find comments with "meow"', async () => {
    mockOctokit.paginate.mockImplementationOnce(async method => {
      if (method === mockOctokit.issues.listComments) {
        return Promise.resolve([
          {
            id: 1,
            body: 'some text before\n<!-- meow -->\nsome text after'
          },
          {
            id: 2,
            body: 'some text before\n<!-- meow -->\nsome text after'
          },
          {
            id: 3,
            body: 'some data'
          },
          {
            id: 4
          }
        ]);
      }
    });

    const meowId = await findMeow('owner', 'repo', 1, '__invalid_token__');
    expect(meowId).toBe(2);
  });

  it('should not find comments with "meow"', async () => {
    mockOctokit.paginate.mockImplementationOnce(async method => {
      if (method === mockOctokit.issues.listComments) {
        return Promise.resolve([
          {
            id: 1,
            body: 'some data'
          }
        ]);
      }
    });

    const meowId = await findMeow('owner', 'repo', 1, '__invalid_token__');
    expect(meowId).toBeUndefined();
  });
});
