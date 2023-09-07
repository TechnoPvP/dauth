import { IsString } from 'class-validator';

export class GithubCallbackDto {
  @IsString()
  code!: string;
}
