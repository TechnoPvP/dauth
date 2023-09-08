import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error | null, user: User) => void) {
    console.log({ user });
    done(null, user);
  }

  deserializeUser(
    payload: User,
    done: (err: Error | null, user: User) => void
  ) {
    console.log({ payload });
    done(null, payload);
  }
}
