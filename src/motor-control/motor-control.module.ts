import { Module } from '@nestjs/common';
import { MotorControlService } from './motor-control.service';
import { MotorControlController } from './motor-control.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [MotorControlService],
  controllers: [MotorControlController],
  imports: [PrismaModule],
})
export class MotorControlModule {}
