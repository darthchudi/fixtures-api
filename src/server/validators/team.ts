import BaseValidator from './base';
import { ITeam } from '../../data/types/team';

class TeamValidator extends BaseValidator<ITeam> {
  create(body: any) {
    const schema = this.joi.object({
      city: this.joi.string(),
      country: this.joi.string(),
      league: this.joi.string().required(),
      name: this.joi.string().required(),
      short_name: this.joi.string(),
      stadium: this.joi.string().required(),
    });

    return this.validate(body, schema, null);
  }

  update(body: any) {
    const schema = this.joi.object({
      area: this.joi.object({
        city: this.joi.string(),
        country: this.joi.string(),
      }),
      league: this.joi.string(),
      name: this.joi.string(),
      short_name: this.joi.string(),
      stadium: this.joi.string(),
    });

    return this.validate(body, schema, null);
  }
}

export default new TeamValidator();
