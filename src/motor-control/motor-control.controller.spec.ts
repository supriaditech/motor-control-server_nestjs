import { Test, TestingModule } from '@nestjs/testing';
import { MotorControlController } from './motor-control.controller';

describe('MotorControlController', () => {
  let controller: MotorControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotorControlController],
    }).compile();

    controller = module.get<MotorControlController>(MotorControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
