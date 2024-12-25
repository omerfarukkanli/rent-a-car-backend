import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: 'manual' })
  provider: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
