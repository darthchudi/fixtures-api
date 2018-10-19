import { IFixture } from '../../data/types/fixture';
import BaseValidator from './base';

class FixtureValidator extends BaseValidator<IFixture> {
  create(body: any) {
    const schema = this.joi.object({
      away_team: this.joi.string().required(),
      competition: this.joi.string().required(),
      date: this.joi.date(),
      group: this.joi.string(),
      home_team: this.joi.string().required(),
      match_day: this.joi.number(),
      stadium: this.joi.string(),
      stage: this.joi.string(),
      status: this.joi.string().valid(['pending', 'ongoing', 'completed']),
      score: this.joi.object({
        winner: this.joi.string(),
        home_team: this.joi.number(),
        away_team: this.joi.number(),
      }),
      time: this.joi.string().required(),
    });

    return this.validate(body, schema, null);
  }

  update(body: any) {
    const schema = this.joi.object({
      date: this.joi.date().required(),
      time: this.joi.string().required(),
    });

    return this.validate(body, schema, null);
  }
}

export default new FixtureValidator();
