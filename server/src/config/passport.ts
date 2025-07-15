import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { Application } from 'express';
import session from 'express-session';
import { getPrismaClient } from '../services/database';

export function setupPassport(app: Application) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          verified: true,
          riskProfile: true,
          createdAt: true,
        },
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Local Strategy (Email/Password)
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const prisma = getPrismaClient();
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Please use social login or reset your password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.verified) {
          return done(null, false, { message: 'Please verify your email address' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // JWT Strategy
  passport.use(new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-jwt-secret',
    },
    async (payload, done) => {
      try {
        const prisma = getPrismaClient();
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verified: true,
            riskProfile: true,
            createdAt: true,
          },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  ));

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const prisma = getPrismaClient();
          
          // Check if user already exists with this Google ID
          let user = await prisma.user.findFirst({
            where: { googleId: profile.id },
          });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with the same email
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await prisma.user.findUnique({
              where: { email: email.toLowerCase() },
            });

            if (user) {
              // Link Google account to existing user
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id },
              });
              return done(null, user);
            }
          }

          // Create new user
          const username = profile.username || 
            profile.displayName?.replace(/\s+/g, '').toLowerCase() || 
            `user_${Date.now()}`;

          user = await prisma.user.create({
            data: {
              email: email?.toLowerCase() || '',
              username: await generateUniqueUsername(username),
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              avatar: profile.photos?.[0]?.value || null,
              googleId: profile.id,
              verified: true, // Google accounts are pre-verified
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));
  }

  // Apple Strategy would go here (similar implementation)
  // Note: Apple requires additional setup for the certificate/key files
}

async function generateUniqueUsername(baseUsername: string): Promise<string> {
  const prisma = getPrismaClient();
  let username = baseUsername;
  let counter = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return username;
    }

    username = `${baseUsername}${counter}`;
    counter++;
  }
}