import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserRoles } from 'src/generic/enum/user.role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;
  @Prop({
    required: true,
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
