export interface GithubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    owner: {
      login: string
    }
  }
  