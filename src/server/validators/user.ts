import { IUser } from '../../data/types/user';
import BaseValidator from './base';

class UserValidator extends BaseValidator<IUser> {
  signUp(body: any) {
    const schema = this.joi.object({
      email: this.joi
        .string()
        .email()
        .required(),
      first_name: this.joi.string().required(),
      last_name: this.joi.string().required(),
      role: this.joi
        .string()
        .trim()
        .valid(['admin', 'user']),
      username: this.joi
        .string()
        .min(4)
        .required(),
      password: this.joi
        .string()
        .required()
        .min(5),
    });

    return this.validate(body, schema, null);
  }

  login(body: any) {
    const schema = this.joi.object({
      username: this.joi
        .string()
        .min(4)
        .required(),
      password: this.joi
        .string()
        .required()
        .trim(),
    });

    return this.validate(body, schema, null);
  }
}

export default new UserValidator();
