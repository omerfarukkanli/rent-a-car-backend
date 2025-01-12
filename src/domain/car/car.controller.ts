import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
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
}
