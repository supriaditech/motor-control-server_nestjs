import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MotorControlModule } from './motor-control/motor-control.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [MotorControlModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
