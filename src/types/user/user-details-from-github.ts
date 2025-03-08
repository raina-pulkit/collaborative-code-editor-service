export interface UserDetailsFromGithub {
  login: string;
  id: number;
  node_id: string;
  avatar_url?: string | null;
  gravatar_id?: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company?: string | null;
  blog: string;
  location?: string | null;
  email?: string | null;
  hireable?: boolean | null;
  bio?: string | null;
  twitter_username?: string | null;
  notification_email?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/* 
  userDetailsFromGithub:  {
  html_url: 'https://github.com/raina-pulkit',
  followers_url: 'https://api.github.com/users/raina-pulkit/followers',
  following_url: 'https://api.github.com/users/raina-pulkit/following{/other_user}',
  gists_url: 'https://api.github.com/users/raina-pulkit/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/raina-pulkit/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/raina-pulkit/subscriptions',
  organizations_url: 'https://api.github.com/users/raina-pulkit/orgs',
  repos_url: 'https://api.github.com/users/raina-pulkit/repos',
  events_url: 'https://api.github.com/users/raina-pulkit/events{/privacy}',
  received_events_url: 'https://api.github.com/users/raina-pulkit/received_events',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
  name: 'Pulkit Raina',
  company: null,
  blog: '',
  location: null,
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  notification_email: null,
  public_repos: 13,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '2023-07-25T18:01:06Z',
  updated_at: '2025-03-08T18:05:29Z'
}
*/
