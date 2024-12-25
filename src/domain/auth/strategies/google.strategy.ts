import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleConfig from 'src/config/google.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleConfig.KEY)
    configService: ConfigType<typeof googleConfig>,
  ) {
    super({
      clientID: configService.clientId,
      clientSecret: configService.clientSecret,
      callbackURL: configService.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      if (!profile || !profile.emails || !profile.name) {
        throw new UnauthorizedException('Invalid profile data');
      }

      const user = {
        provider: 'google',
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        accessToken,
      };
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
}
