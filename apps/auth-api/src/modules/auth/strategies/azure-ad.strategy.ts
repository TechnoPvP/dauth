import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  OIDCStrategy,
  IOIDCStrategyOption,
  BearerStrategy,
} from 'passport-azure-ad';
import { MicrosoftProfileEntity } from '../entities/microsoft-profile.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class AzureAdAuthStrategy extends PassportStrategy(
  OIDCStrategy,
  'azure-ad'
) {
  constructor(private readonly authService: AuthService) {
    const identityMetadata = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`;

    super({
      loggingNoPII: false,
      passReqToCallback: false,
      loggingLevel: 'info',
      identityMetadata: identityMetadata,
      clientID: process.env['AZURE_CLIENT_ID'],
      clientSecret: process.env['AZURE_CLIENT_SECRET'],
      responseType: 'id_token code',
      responseMode: 'form_post',
      redirectUrl: 'http://localhost:5050/auth/azure/callback', // This should match your redirect URI in Azure portal
      allowHttpForRedirectUrl: true,
      tenantIdOrName: process.env.AZURE_TENANT_ID,
      scope: 'openid profile email', // This ensures you get the ID token
    } as IOIDCStrategyOption);
  }

  // The validate method will extract the user profile from the ID token
  async validate(
    profile: MicrosoftProfileEntity,
    done: (error: string | null, profile: MicrosoftProfileEntity) => void
  ) {
    await this.authService.microsoftCallback({ profile: profile });

    done(null, profile);
  }
}
