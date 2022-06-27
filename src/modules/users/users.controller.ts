import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import validationPipeOptions from 'src/constants/validation-pipe.constant';
import { Serialize } from 'src/interceptors/serialiaze.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decoratos';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @UseGuards(AuthGuard)
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async signinUpCreate(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async signin(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(createUserDto);
    session.userId = user.id;
    return user;
  }

  // @Post()
  // @UseGuards(AuthGuard)
  // create(
  //   @Body(new ValidationPipe(validationPipeOptions))
  //   createUserDto: CreateUserDto,
  // ) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: UserDto) {
    return this.usersService.findAll(query);
  }

  @Get('email')
  findForAuth(@Query('email') email: string) {
    return this.usersService.findForAuth(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @UseGuards(AuthGuard)
  restore(@Param('id') id: string) {
    return this.usersService.restore(+id);
  }
}
