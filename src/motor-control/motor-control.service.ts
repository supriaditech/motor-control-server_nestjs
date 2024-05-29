import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModalControlDto } from './dto/CreateModalControlDto';
import { ReadlineParser, SerialPort } from 'serialport';

@Injectable()
export class MotorControlService {
  private readonly port: SerialPort;
  private readonly parser: ReadlineParser;
  constructor(private prisma: PrismaService) {
    this.port = new SerialPort({ path: 'COM11', baudRate: 9600 }, (err) => {
      if (err) {
        console.log('Error opening port: ', err.message);
      }
    });

    // Setup parser for reading line-by-line
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
    this.parser.on('data', this.handleSerialData.bind(this));
  }

  private handleSerialData(data: string) {
    try {
      const json = JSON.parse(data);
      console.log('Received data from Arduino:', json);
      // Additional logic to handle the data
      this.processReceivedData(json);
    } catch (error) {
      console.error('Error parsing JSON from serial:', error);
    }
  }

  async processReceivedData(json: any) {
    const currentTime = this.getCurrentLocalTime();
    console.log(currentTime, '================================');
    const prosesData = await this.prisma.resultSpeedRpm.create({
      data: {
        speedRpm: json.calculatedRPM,
        createdAt: currentTime,
      },
    });

    if (prosesData) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Hasil Motor control berhasil di buat',
        data: prosesData,
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Hasil Motor control gagal di buat',
        data: null,
      };
    }
  }
  async CreateMotorControlService(data: CreateModalControlDto) {
    try {
      await new Promise((resolve, reject) => {
        this.port.write(JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Data sent to Arduino', JSON.stringify(data));
            resolve(null);
          }
        });
      });

      // Menyimpan data ke database jika pengiriman ke Arduino berhasil
      const createMotorControl = await this.prisma.motorKontrol.create({
        data: data,
      });
      // this.closeSerialPort();

      return {
        statusCode: HttpStatus.OK,
        message: 'Motor control berhasil dibuat',
        data: createMotorControl,
      };
    } catch (error) {
      console.error('Error: ', error.message);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Gagal mengirim data ke Arduino atau menyimpan ke database',
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

  async GetSpeedMotorControlByDate() {
    try {
      // Fetch the latest results by date, possibly limiting the amount of data returned
      const getMotor = await this.prisma.resultSpeedRpm.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by 'createdAt' column in descending order
        },
        take: 10, // Limit the number of records retrieved, adjust this number as needed
      });

      // Check if the result array is not empty
      if (getMotor.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Motor control data successfully loaded',
          data: getMotor,
        };
      } else {
        // Return a different HTTP status code if no data is found
        return {
          statusCode: HttpStatus.NOT_FOUND, // Using NOT FOUND status for empty data
          message: 'No motor control data found',
          data: [],
        };
      }
    } catch (error) {
      // Handle any unexpected errors that may occur during the database query
      console.error('Failed to retrieve motor control data:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR, // Use appropriate status for server errors
        message: 'Error retrieving motor control data',
        data: null,
      };
    }
  }

  // src/motor-control/motor-control.service.ts

  async sendCommandToArduino(data: number): Promise<any> {
    data === 0;
    try {
      await new Promise((resolve, reject) => {
        this.port.write(JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Data sent to Arduino', JSON.stringify(data));
            resolve(null);
          }
        });
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Motor control berhasil dibuat',
        data: null,
      };
    } catch (error) {
      console.error('Error: ', error.message);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Gagal mengirim data ke Arduino atau menyimpan ke database',
        data: null,
      };
    }
  }

  closeSerialPort() {
    if (this.port.isOpen) {
      this.port.close((err) => {
        if (err) {
          console.log('Error closing port: ', err.message);
        } else {
          console.log('Port closed successfully');
        }
      });
    }
  }
  private getCurrentLocalTime(): string {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localTime.toISOString();
  }
}
