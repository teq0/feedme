import { Express } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Issuer, Strategy as OpenIDStrategy } from 'openid-client';
import { config } from './config';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

// Initialize services
const userService = new UserService();

// JWT Strategy options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

// Setup authentication strategies
export const setupAuth = async (app: Express) => {
  // Initialize passport
  app.use(passport.initialize());

  // Local Strategy (email/password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await userService.validateUser(email, password);
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // JWT Strategy
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await userService.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // Setup OIDC strategies if credentials are provided
  try {
    // Google OIDC
    if (config.oidc.google.clientId && config.oidc.google.clientSecret) {
      const googleIssuer = await Issuer.discover('https://accounts.google.com');
      const googleClient = new googleIssuer.Client({
        client_id: config.oidc.google.clientId,
        client_secret: config.oidc.google.clientSecret,
        redirect_uris: [config.oidc.google.callbackUrl],
        response_types: ['code'],
      });

      passport.use(
        'google',
        new OpenIDStrategy(
          {
            client: googleClient,
            params: {
              scope: 'openid email profile',
            },
          },
          async (tokenSet, userinfo, done) => {
            try {
              const user = await userService.findOrCreateOidcUser({
                provider: 'google',
                providerId: userinfo.sub,
                email: userinfo.email,
                name: userinfo.name,
                picture: userinfo.picture,
              });
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    }

    // GitHub OIDC
    if (config.oidc.github.clientId && config.oidc.github.clientSecret) {
      const githubIssuer = await Issuer.discover('https://github.com/.well-known/openid-configuration');
      const githubClient = new githubIssuer.Client({
        client_id: config.oidc.github.clientId,
        client_secret: config.oidc.github.clientSecret,
        redirect_uris: [config.oidc.github.callbackUrl],
        response_types: ['code'],
      });

      passport.use(
        'github',
        new OpenIDStrategy(
          {
            client: githubClient,
            params: {
              scope: 'openid email profile',
            },
          },
          async (tokenSet, userinfo, done) => {
            try {
              const user = await userService.findOrCreateOidcUser({
                provider: 'github',
                providerId: userinfo.sub,
                email: userinfo.email,
                name: userinfo.name,
                picture: userinfo.picture,
              });
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    }

    // Microsoft OIDC
    if (config.oidc.microsoft.clientId && config.oidc.microsoft.clientSecret) {
      const microsoftIssuer = await Issuer.discover('https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration');
      const microsoftClient = new microsoftIssuer.Client({
        client_id: config.oidc.microsoft.clientId,
        client_secret: config.oidc.microsoft.clientSecret,
        redirect_uris: [config.oidc.microsoft.callbackUrl],
        response_types: ['code'],
      });

      passport.use(
        'microsoft',
        new OpenIDStrategy(
          {
            client: microsoftClient,
            params: {
              scope: 'openid email profile',
            },
          },
          async (tokenSet, userinfo, done) => {
            try {
              const user = await userService.findOrCreateOidcUser({
                provider: 'microsoft',
                providerId: userinfo.sub,
                email: userinfo.email,
                name: userinfo.name,
                picture: userinfo.picture,
              });
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    }
  } catch (error) {
    logger.error('Error setting up OIDC strategies:', error);
  }

  logger.info('Authentication strategies configured');
};