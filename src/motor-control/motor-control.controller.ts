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
  @Post('get-speed-by-date')
  async GetSpeedModalControl() {
    return await this.motorControlService.GetSpeedMotorControlByDate();
  }

  @Post('/send-command')
  async sendCommand() {
    return await this.motorControlService.sendCommandToArduino(0);
  }
}
