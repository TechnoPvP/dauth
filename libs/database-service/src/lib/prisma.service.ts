import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({});
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(
        'Database connection established successfully',
        process.env['DATABASE_URL']
      );
    } catch (error) {
      this.logger.error('Failed to connect to prisma database', error);
      process.exit(1);
    }
  }
}
