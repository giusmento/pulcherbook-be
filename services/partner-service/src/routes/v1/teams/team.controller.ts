import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
} from "@giusmento/mangojs-core";
import { PartnerContainer } from "../../../inversify.config";
import { TeamService } from "../../../service/team.service";
import { CreateTeamRequest, UpdateTeamRequest } from "../../../types/types";

// Resolve service from container
const teamService = PartnerContainer.get<TeamService>(TeamService);

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
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreateTeamRequest = req.body;
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
   * /api/v1/teams/{id}:
   *   get:
   *     summary: Get team by ID
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Get("/:id")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const team = await this.teamService.findById(id);

      if (!team) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team not found",
        };
        return res.status(404).send(apiResponse);
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
  public async findAll(req: Request, res: Response): Promise<Response> {
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
   * /api/v1/teams/{id}:
   *   put:
   *     summary: Update team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Put("/:id")
  public async update(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const data: UpdateTeamRequest = req.body;
      const team = await this.teamService.update(id, data);

      if (!team) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team not found",
        };
        return res.status(404).send(apiResponse);
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
   * /api/v1/teams/{id}:
   *   delete:
   *     summary: Delete team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Delete("/:id")
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const success = await this.teamService.delete(id);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team not found",
        };
        return res.status(404).send(apiResponse);
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
