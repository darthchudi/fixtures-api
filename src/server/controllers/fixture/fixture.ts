import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
  httpGet,
  httpDelete,
  requestParam,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { Request, Response } from 'express';

import BaseController from '../base';
import FixtureRepository from '../../../data/respositories/fixture/fixture';
import TeamRepository from '../../../data/respositories/team';
import CONSTANTS from '../../../common/constants/identifiers';

import validator from '../../validators/fixture';
import parseQuery from '../../helpers/parseQuery';

@controller('/fixture')
export default class FixtureController extends BaseController {
  _fixture: FixtureRepository;
  _team: TeamRepository;
  constructor(
    @inject(CONSTANTS.FIXTURE_REPOSITORY) _fixture: FixtureRepository,
    @inject(CONSTANTS.TEAM_REPOSITORY) _team: TeamRepository
  ) {
    super();
    this._fixture = _fixture;
    this._team = _team;
  }

  @httpPost('/')
  async create(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: any
  ) {
    const { err, result } = validator.create(body);
    if (err) return this.handleValidationError(err, req, res);

    try {
      //Verify that both teams exist
      const homeTeam = await this._team.byID(<string>result.home_team);
      const awayTeam = await this._team.byID(<string>result.away_team);

      //if the stadium is not set, default to the home team stadium
      if (!result.stadium) result.stadium = homeTeam.stadium;

      //throw an error if both ids are the same
      if (homeTeam._id === awayTeam._id)
        throw new Error('Home team cannot be the same as away team');

      const fixture = await this._fixture.create(result);
      this.handleSuccess(fixture, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpGet('/:id')
  async find(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string
  ) {
    try {
      const fixture = await this._fixture.byID(id);
      this.handleSuccess(fixture, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpGet('/')
  async all(@request() req: Request, @response() res: Response) {
    const conditions = parseQuery({ ...req.query });

    try {
      const fixtures = await this._fixture.all({
        conditions,
      });

      this.handleSuccess(fixtures, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpPut('/:id')
  async update(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: any,
    @requestParam('id') id: string
  ) {
    const { err, result } = validator.update(body);
    if (err) return this.handleValidationError(err, req, res);

    try {
      const updatedFixture = await this._fixture.update(id, result);
      this.handleSuccess(updatedFixture, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpDelete('/:id')
  async delete(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string
  ) {
    try {
      await this._fixture.delete(id);
      this.handleSuccess({ message: 'Successfully deleted fixture' }, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }
}
