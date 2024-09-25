import * as core from '@actions/core';

const CAT_API_URL = 'https://cataas.com/cat';
const CAT_ERROR = 'https://http.cat/images/500.jpg';

interface CatApi {
  _id: number;
}

export async function getRandomCatImage(): Promise<string> {
  try {
    const response = await fetch(CAT_API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      core.debug(`Failed to fetch a random cat image: ${response.statusText}`);
      return CAT_ERROR;
    }

    const responseData: CatApi = await response.json();
    return `${CAT_API_URL}/${responseData._id}`;
  } catch (error) {
    core.debug(`Error: ${error}`);
    return CAT_ERROR;
  }
}
