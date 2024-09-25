import { getRandomCatImage } from './cat';
import { describe, it, expect } from '@jest/globals';
import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';

enableFetchMocks();
const fetchMock = fetch as FetchMock;

describe('Cat', () => {
  it('should return a cat image', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ _id: 1 }));

    const catImageUrl = await getRandomCatImage();
    expect(catImageUrl).toBe('https://cataas.com/cat/1');
  });

  it('should return a 500 cat error image if the response is not ok', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });

    const catImageUrl = await getRandomCatImage();
    expect(catImageUrl).toBe('https://http.cat/images/500.jpg');
  });

  it('should return a 500 cat error image if something happens', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch a random cat image'));

    const catImageUrl = await getRandomCatImage();
    expect(catImageUrl).toBe('https://http.cat/images/500.jpg');
    //x 
  });
});
