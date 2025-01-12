import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schema/car.schema';
import { CreateCarDto } from './dto/create.car.dto';
import { SuccessResponseDto } from 'src/generic/dto/SuccessResponseDto';
import { ErrorResponseDto } from 'src/generic/dto/ErrorResponseDto';

@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<Car>) {}

  async createCar(
    createCarDto: CreateCarDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const createdCar = new this.carModel(createCarDto);
      await createdCar.save();
      return new SuccessResponseDto(
        true,
        HttpStatus.CREATED,
        'Car Created Successfully',
        createdCar,
      );
    } catch (error) {
      return new ErrorResponseDto(
        false,
        HttpStatus.BAD_REQUEST,
        error.message,
        'car/create',
      );
    }
  }
}
