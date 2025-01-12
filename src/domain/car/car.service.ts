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

  async getAllCars(): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const cars = await this.carModel.find().exec();
      return new SuccessResponseDto(
        true,
        HttpStatus.OK,
        'Cars Fetched Successfully',
        cars,
      );
    } catch (error) {
      return new ErrorResponseDto(
        false,
        HttpStatus.BAD_REQUEST,
        error.message,
        'car/getAll',
      );
    }
  }

  async getCarById(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const car = await this.carModel.findById(id).exec();
      return new SuccessResponseDto(
        true,
        HttpStatus.OK,
        'Car Fetched Successfully',
        car,
      );
    } catch (error) {
      return new ErrorResponseDto(
        false,
        HttpStatus.BAD_REQUEST,
        error.message,
        'car/getById',
      );
    }
  }

  async updateCar(
    id: string,
    createCarDto: CreateCarDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const updatedCar = await this.carModel.findByIdAndUpdate(
        id,
        createCarDto,
        { new: true },
      );

      return new SuccessResponseDto(
        true,
        HttpStatus.OK,
        'Car Updated Successfully',
        updatedCar,
      );
    } catch (error) {
      return new ErrorResponseDto(
        false,
        HttpStatus.BAD_REQUEST,
        error.message,
        'car/update',
      );
    }
  }

  async deleteCar(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      await this.carModel.findByIdAndDelete(id).exec();
      return new SuccessResponseDto(
        true,
        HttpStatus.OK,
        'Car Deleted Successfully',
        null,
      );
    } catch (error) {
      return new ErrorResponseDto(
        false,
        HttpStatus.BAD_REQUEST,
        error.message,
        'car/delete',
      );
    }
  }
}
