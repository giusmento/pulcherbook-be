import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
  Containers,
  Decorators,
} from "@giusmento/mangojs-core";
import { TeamService } from "../../../services/team.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type TeamPost = PBTypes.partner.entities.TeamPost;
type TeamPut = PBTypes.partner.entities.TeamPut;

// Resolve service from container
const teamService = partnerContainer.get<TeamService>(TeamService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management endpoints
 */
@Controller("/api/v1/teams")
export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = teamService;
  }

  /**
   * @swagger
   * /api/v1/teams:
   *   post:
   *     summary: Create a new team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - partner_id
   *               - name
   *             properties:
   *               partner_id:
   *                 type: string
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Team created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async create(
    req: Request<
      PBTypes.partner.api.v1.teams.POST.Params,
      PBTypes.partner.api.v1.teams.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teams.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teams.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: TeamPost = req.body;
      const team = await this.teamService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: team,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/teams/{uid}:
   *   get:
   *     summary: Get team by ID
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Team ID
   *     responses:
   *       200:
   *         description: Team details
   *       404:
   *         description: Team not found
   */
  @Get("/:uid")
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.teams.GET.ParamsSingle,
      PBTypes.partner.api.v1.teams.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teams.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.teams.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const team = await this.teamService.findById(uid);

      if (!team) {
        throw new errors.APIError(404, "NOT_FOUND", "Team not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: team,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/teams:
   *   get:
   *     summary: Get all teams
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: partner_id
   *         schema:
   *           type: string
   *         description: Filter by partner ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Number of items to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of items to skip
   *     responses:
   *       200:
   *         description: List of teams
   */
  @Get("/")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.teams.GET.Params,
      PBTypes.partner.api.v1.teams.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teams.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teams.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const partner_id = req.query.partner_id as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const teams = await this.teamService.findAll(partner_id, limit, offset);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teams,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/teams/{uid}:
   *   put:
   *     summary: Update team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Team ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Team updated successfully
   *       404:
   *         description: Team not found
   */
  @Put("/:uid")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async update(
    req: Request<
      PBTypes.partner.api.v1.teams.PUT.Params,
      PBTypes.partner.api.v1.teams.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teams.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teams.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: TeamPut = req.body;
      const team = await this.teamService.update(uid, data);

      if (!team) {
        throw new errors.APIError(404, "NOT_FOUND", "Team not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: team,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/teams/{uid}:
   *   delete:
   *     summary: Delete team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Team ID
   *     responses:
   *       200:
   *         description: Team deleted successfully
   *       404:
   *         description: Team not found
   */
  @Delete("/:uid")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.teams.DELETE.Params,
      PBTypes.partner.api.v1.teams.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teams.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teams.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.teamService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Team not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Team deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
