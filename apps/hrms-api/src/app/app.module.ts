import { AuthModule } from '@dauth/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
