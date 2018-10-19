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
import TeamRepository from '../../../data/respositories/team';
import CONSTANTS from '../../../common/constants/identifiers';
import validator from '../../validators/team';

@controller('/team')
export default class TeamController extends BaseController {
  _team: TeamRepository;
  constructor(@inject(CONSTANTS.TEAM_REPOSITORY) _team: TeamRepository) {
    super();
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
      const team = await this._team.create(result);
      this.handleSuccess(team, req, res);
    } catch (e) {
      return this.handleError(e, req, res);
    }
  }

  @httpGet('/:id')
  async find(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string
  ) {
    try {
      const team = await this._team.byID(id);
      this.handleSuccess(team, req, res);
    } catch (e) {
      return this.handleError(e, req, res);
    }
  }

  @httpGet('/')
  async all(@request() req: Request, @response() res: Response) {
    const conditions = { ...req.query };

    try {
      const teams = await this._team.all({
        conditions,
      });
      this.handleSuccess(teams, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }

  @httpPut('/:id')
  async edit(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: any,
    @requestParam('id') id: string
  ) {
    const { err, result } = validator.update(body);

    if (err) return this.handleValidationError(err, req, res);

    try {
      const updatedTeam = await this._team.update(id, result);
      this.handleSuccess(updatedTeam, req, res);
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
      await this._team.delete(id);
      this.handleSuccess({ message: 'Successfully deleted team' }, req, res);
    } catch (e) {
      this.handleError(e, req, res);
    }
  }
}
