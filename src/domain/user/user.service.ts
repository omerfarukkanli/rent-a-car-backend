import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { createGoogleUserDto, createUserDto } from './dto/createUserDto';
import { UserRoles } from 'src/generic/user.role';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    user: createUserDto | createGoogleUserDto,
  ): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findByEmailFromRole(email: string) {
    try {
      const user = await this.findOneByEmail(email);
      return user?.role as UserRoles;
    } catch (error) {
      throw new HttpException(
        error,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
