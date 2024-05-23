import { Test, TestingModule } from '@nestjs/testing';
import { MotorControlService } from './motor-control.service';

describe('MotorControlService', () => {
  let service: MotorControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MotorControlService],
    }).compile();

    service = module.get<MotorControlService>(MotorControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
