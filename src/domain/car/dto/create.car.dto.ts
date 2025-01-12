import { ApiProperty } from '@nestjs/swagger';
import { CarFuelType, CarType } from 'src/generic/enum/car.type.enum';

export class CreateCarDto {
  @ApiProperty({ default: 'Toyota' })
  brand: string;
  @ApiProperty({ default: 'Corolla' })
  carModel: string;
  @ApiProperty({ default: CarType.SEDAN })
  carType: CarType;
  @ApiProperty({ default: CarFuelType.GASOLINE })
  carFuelType: CarFuelType;
  @ApiProperty({ default: '2015' })
  year: string;
  @ApiProperty({ default: 'White' })
  color: string;
  @ApiProperty({ default: 'https://example.com/image.jpg' })
  image: string;
}
