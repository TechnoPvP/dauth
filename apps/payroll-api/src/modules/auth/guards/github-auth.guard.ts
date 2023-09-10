import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import passport from 'passport';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const redirectUrl = request.query?.redirectUrl as string;
    if (redirectUrl) request.session.redirectUrl = redirectUrl;

    const result = (await super.canActivate(context)) as boolean;
    const user = request?.user;

    if (!user) return false;

    await new Promise<void>((resolve, reject) =>
      request.logIn(
        { ...user },
        { session: true, keepSessionInfo: true },
        (err: any) => (err ? reject(err) : resolve())
      )
    );

    return result;
  }
}

const lol = {
  cookie: {
    originalMaxAge: 86400000,
    expires: '2023-09-11T21:12:22.295Z',
    secure: false,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  },
  passport: {
    user: {
      id: '5841530',
      nodeId: 'MDQ6VXNlcjU4NDE1MzA=',
      displayName: 'Adam Ghowiba',
      username: 'TechnoPvP',
      profileUrl: 'https://github.com/TechnoPvP',
      emails: [{ value: 'adamware99@hotmail.com' }],
      photos: [
        { value: 'https://avatars.githubusercontent.com/u/5841530?v=4' },
      ],
      provider: 'github',
      _raw: '{"login":"TechnoPvP","id":5841530,"node_id":"MDQ6VXNlcjU4NDE1MzA=","avatar_url":"https://avatars.githubusercontent.com/u/5841530?v=4","gravatar_id":"","url":"https://api.github.com/users/TechnoPvP","html_url":"https://github.com/TechnoPvP","followers_url":"https://api.github.com/users/TechnoPvP/followers","following_url":"https://api.github.com/users/TechnoPvP/following{/other_user}","gists_url":"https://api.github.com/users/TechnoPvP/gists{/gist_id}","starred_url":"https://api.github.com/users/TechnoPvP/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/TechnoPvP/subscriptions","organizations_url":"https://api.github.com/users/TechnoPvP/orgs","repos_url":"https://api.github.com/users/TechnoPvP/repos","events_url":"https://api.github.com/users/TechnoPvP/events{/privacy}","received_events_url":"https://api.github.com/users/TechnoPvP/received_events","type":"User","site_admin":false,"name":"Adam Ghowiba","company":"Web Revived","blog":"https://www.twitter.com/webrevived","location":"United States","email":"adamware99@hotmail.com","hireable":true,"bio":" A passionate full-stack engineer & svelte enthusiast. ","twitter_username":null,"public_repos":38,"public_gists":0,"followers":8,"following":10,"created_at":"2013-11-03T02:44:38Z","updated_at":"2023-09-10T11:25:50Z"}',
      _json: {
        login: 'TechnoPvP',
        id: 5841530,
        node_id: 'MDQ6VXNlcjU4NDE1MzA=',
        avatar_url: 'https://avatars.githubusercontent.com/u/5841530?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/TechnoPvP',
        html_url: 'https://github.com/TechnoPvP',
        followers_url: 'https://api.github.com/users/TechnoPvP/followers',
        following_url:
          'https://api.github.com/users/TechnoPvP/following{/other_user}',
        gists_url: 'https://api.github.com/users/TechnoPvP/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/TechnoPvP/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/TechnoPvP/subscriptions',
        organizations_url: 'https://api.github.com/users/TechnoPvP/orgs',
        repos_url: 'https://api.github.com/users/TechnoPvP/repos',
        events_url: 'https://api.github.com/users/TechnoPvP/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/TechnoPvP/received_events',
        type: 'User',
        site_admin: false,
        name: 'Adam Ghowiba',
        company: 'Web Revived',
        blog: 'https://www.twitter.com/webrevived',
        location: 'United States',
        email: 'adamware99@hotmail.com',
        hireable: true,
        bio: ' A passionate full-stack engineer & svelte enthusiast. ',
        twitter_username: null,
        public_repos: 38,
        public_gists: 0,
        followers: 8,
        following: 10,
        created_at: '2013-11-03T02:44:38Z',
        updated_at: '2023-09-10T11:25:50Z',
      },
    },
  },
  redirectUrl: 'https://webrevived.com',
};
