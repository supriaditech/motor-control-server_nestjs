import { Body, Controller, Post } from '@nestjs/common';
import { MotorControlService } from './motor-control.service';
import { CreateModalControlDto } from './dto/CreateModalControlDto';

@Controller('motor-control')
export class MotorControlController {
  constructor(private motorControlService: MotorControlService) {}

  @Post('create')
  async CreateModalControlController(@Body() data: CreateModalControlDto) {
    return await this.motorControlService.CreateMotorControlService(data);
  }

  @Post('get-by-date')
  async GetModalControl() {
    return await this.motorControlService.GetMotorControlByDate();
  }
}
