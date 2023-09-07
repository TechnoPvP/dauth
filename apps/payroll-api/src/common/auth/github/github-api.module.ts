import { Module } from '@nestjs/common';
import { GithubApi } from './github.api';

@Module({
  providers: [{ provide: GithubApi, useValue: new GithubApi() }],
  exports: [GithubApi],
})
export class GithubApiModule {}
