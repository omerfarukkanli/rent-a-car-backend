import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/decorator/user.role.decorator';
import { UserRoles } from 'src/generic/enum/user.role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create.car.dto';
import { SuccessResponseDto } from 'src/generic/dto/SuccessResponseDto';
import { ErrorResponseDto } from 'src/generic/dto/ErrorResponseDto';
import { Response } from 'express';

@Controller('car')
export class CarController {
  constructor(private carService: CarService) {}

  @Post('create')
  @ApiBearerAuth()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  async createCar(@Body() createCarDto: CreateCarDto, @Res() res: Response) {
    const createCar: SuccessResponseDto | ErrorResponseDto =
      await this.carService.createCar(createCarDto);
    res.status(createCar.statusCode).send(createCar);
  }

  @Get()
  async getAllCars(@Res() res: Response) {
    const allCars: SuccessResponseDto | ErrorResponseDto =
      await this.carService.getAllCars();
    res.status(allCars.statusCode).send(allCars);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  async getCarById(@Param(':id') id: string, @Res() res: Response) {
    const car: SuccessResponseDto | ErrorResponseDto =
      await this.carService.getCarById(id);
    res.status(car.statusCode).send(car);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', required: true })
  async updateCarById(
    @Param('id') id: string,
    @Body() updateCarDto: CreateCarDto,
    @Res() res: Response,
  ) {
    const updatedCar: SuccessResponseDto | ErrorResponseDto =
      await this.carService.updateCar(id, updateCarDto);
    res.status(updatedCar.statusCode).send(updatedCar);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', required: true })
  async deleteCarById(@Param('id') id: string, @Res() res: Response) {
    const deletedCar: SuccessResponseDto | ErrorResponseDto =
      await this.carService.deleteCar(id);
    res.status(deletedCar.statusCode).send(deletedCar);
  }
}
