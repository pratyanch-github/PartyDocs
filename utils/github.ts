
export const githubApiFetch = (url: string) => {
  return fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });
};
