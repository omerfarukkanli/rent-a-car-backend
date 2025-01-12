import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { CarFuelType, CarType } from 'src/generic/enum/car.type.enum';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car extends Document {
  @Prop({ required: true, type: String })
  brand: string;

  @Prop({ required: true, type: String })
  carModel: string;

  @Prop({
    required: true,
    type: String,
    enum: CarType,
  })
  carType;

  @Prop({
    required: true,
    type: String,
    enum: CarFuelType,
  })
  carFuelType;

  @Prop({ required: true, type: String })
  year: string;

  @Prop({ required: true, type: String })
  color: string;

  @Prop({ required: true, type: String })
  image: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
