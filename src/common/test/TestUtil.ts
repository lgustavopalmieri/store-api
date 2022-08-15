import { User } from '../../../src/modules/users/entities/user.entity';

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Buba';
    user.id = 1;
    return user;
  }
  static createAValidUser(): User {
    const user = new User();
    user.name = 'Buba';
    user.email = 'valid@email.com';
    user.cpf = '09724507015';
    user.password = 'password';
    user.admin = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
  }
}
