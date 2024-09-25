import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';

export async function findMeow(
  owner: string,
  repo: string,
  issue: number,
  token: string
): Promise<number | undefined> {
  core.debug(`Finding meow in ${owner}/${repo}#${issue}`);
  const octokit = new Octokit({
    auth: token
  });

  // lookup issue comment for repo that contains the hidden markdown `<!-- meow -->`. If a match return the latest one. Keep in mind the large number of comments (pageination).
  const comments = await octokit.paginate(octokit.issues.listComments, {
    owner,
    repo,
    issue_number: issue
  });

  let meowComment;
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].body?.includes('<!-- meow -->')) {
      meowComment = comments[i];
      break;
    }
  }

  if (meowComment) {
    return meowComment.id;
  } else {
    return undefined;
  }
}

export async function insertMeow(
  owner: string,
  repo: string,
  issue: number,
  token: string,
  catImageUrl: string,
  commentId?: number
): Promise<void> {
  const octokit = new Octokit({
    auth: token
  });

  const comment = `![Meow](${catImageUrl})\n<!-- meow -->`;
  if (commentId) {
    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: comment
    });
  } else {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue,
      body: comment
    });
  }
}
