import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModalControlDto } from './dto/CreateModalControlDto';
import { SerialPort } from 'serialport';

@Injectable()
export class MotorControlService {
  private readonly port: SerialPort;
  constructor(private prisma: PrismaService) {
    this.port = new SerialPort(
      { path: '/dev/ttyUSB0', baudRate: 9600 },
      (err) => {
        if (err) {
          return console.log('Error opening port: ', err.message);
        }
      },
    );
  }

  async CreateMotorControlService(data: CreateModalControlDto) {
    const createMotorControl = await this.prisma.motorKontrol.create({
      data: data,
    });

    if (createMotorControl) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Motor control berhasil di buat',
        data: createMotorControl,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Motor control gagal di buat',
        data: null,
      };
    }
  }

  async GetMotorControlByDate() {
    const getMotor = await this.prisma.motorKontrol.findFirst({
      orderBy: {
        createdAt: 'desc', // Urutkan berdasarkan kolom 'createdAt' secara descending
      },
    });

    if (getMotor) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Motor control berhasil di muat',
        data: getMotor,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Motor control gagal di muat',
        data: null,
      };
    }
  }
}
