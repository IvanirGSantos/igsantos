import { describe, it, expect, jest } from '@jest/globals';
import { findMeow } from './github';
import { getRandomCatImage } from './cat';
import { run } from './main';
import { setFailed } from '@actions/core';

jest.mock('./github', () => ({
  findMeow: jest.fn(),
  insertMeow: jest.fn()
}));

jest.mock('./cat', () => ({
  getRandomCatImage: jest
    .fn()
    .mockReturnValue('https://http.cat/images/200.jpg')
}));

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'owner',
      repo: 'repo'
    },
    issue: {
      number: 1
    }
  }
}));

// mock core setfailed
jest.mock('@actions/core', () => ({
  ...jest.requireActual<Record<string, unknown>>('@actions/core'),
  setFailed: jest.fn()
}));

describe('Main', () => {
  beforeEach(() => {
    delete process.env['INPUT_GITHUB_TOKEN'];
  });

  it('should call findMeow, getRandomCatImage and insertMeow', async () => {
    process.env['INPUT_GITHUB_TOKEN'] = '__fake_token__';
    await run();
    expect(findMeow).toHaveBeenCalled();
    expect(getRandomCatImage).toHaveBeenCalled();
  });

  it('should error if token is not set.', async () => {
    await run();
    expect(setFailed).toHaveBeenCalledWith('Inserting cat failed');
  });
});
