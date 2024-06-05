import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateModalControlDto {
  @IsNumber()
  @IsNotEmpty()
  rpmMotor: number;

  secconds?: number;
}
