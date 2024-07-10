import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto.st";
import { FindOneUserRequestDto } from "./dto/find-one-user-request.dto";
import { UserEntity } from "../../entity/user.entity";
import { Repository } from "typeorm";
import { FindOneUserResponseDto } from "./dto/find-one-user-response.dto";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneUserByUsernameRequestDto } from "./dto/find-one-user-by-username-request.dto"; // This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneUser(
    request: FindOneUserRequestDto,
  ): Promise<FindOneUserResponseDto> {
    console.log(request, "findOneUser");
    let existUser = await this.userRepository.findOne({
      where: { id: request.id },
    });

    if (!existUser) {
      throw new HttpException(
        {
          code: "NOT_EXIST_USER",
          status: HttpStatus.NOT_FOUND,
          message: `가입 하지 않은 사용자(id : ${request.id})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    console.log(existUser, "findOneUser", "existUser");

    return Object.assign(existUser);
  }

  async findOneUserByUsername(
    request: FindOneUserByUsernameRequestDto,
  ): Promise<FindOneUserResponseDto> {
    console.log(request, "findOneUserByUsername");
    let existUser = await this.userRepository.findOne({
      where: { username: request.username },
    });

    if (!existUser) {
      throw new HttpException(
        {
          code: "NOT_EXIST_USER",
          status: HttpStatus.NOT_FOUND,
          message: `가입 하지 않은 사용자(username : ${request.username})`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    console.log(existUser, "findOneUserByUsername", "existUser");

    return Object.assign(existUser);
  }

  async createUser(
    request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    console.log(request, "createUser");

    const existUser = await this.userRepository.findOne({
      where: { username: request.username },
    });

    if (existUser) {
      throw new HttpException(
        {
          code: "ALREADY_EXIST_USER",
          status: HttpStatus.CONFLICT,
          message: `이미 가입된 사용자(username : ${request.username})`,
        },
        HttpStatus.CONFLICT,
      );
    }

    const creatableUser = await this.userRepository.create(request);

    const createdUser = await this.userRepository.save(creatableUser);

    console.log(createdUser, "createUser", "createdUser");

    return Object.assign(createdUser);
  }
}
