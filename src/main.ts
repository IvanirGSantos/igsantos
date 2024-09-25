import * as core from '@actions/core';
import { context } from '@actions/github';
import { findMeow, insertMeow } from './github';
import { getRandomCatImage } from './cat';

export async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN', { required: true });
    core.setSecret(githubToken);

    core.debug(`Context: ${JSON.stringify(context, null, 2)}`);

    const id = await findMeow(
      context.repo.owner,
      context.repo.repo,
      context.issue.number,
      githubToken
    );
    core.debug(`Meow id: ${id}`);
    const image = await getRandomCatImage();
    core.debug(`Cat image: ${image}`);
    await insertMeow(
      context.repo.owner,
      context.repo.repo,
      context.issue.number,
      githubToken,
      image,
      id
    );
    core.debug('Meow inserted');
  } catch (error) {
    core.setFailed('Inserting cat failed');
  }
}
