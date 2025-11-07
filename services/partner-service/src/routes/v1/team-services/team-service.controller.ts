import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Delete,
  utils,
  errors,
  Containers,
} from "@giusmento/mangojs-core";
import { TeamServiceService } from "../../../services/team-service.service";
import { CreateTeamServiceRequest } from "../../../types/types";

// Resolve service from container
const teamServiceService = Containers.getContainer().get<TeamServiceService>(
  TeamServiceService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: TeamServices
 *   description: Team service assignment endpoints
 */
@Controller("/api/v1/team-services")
export class TeamServiceController {
  private teamServiceService: TeamServiceService;

  constructor() {
    this.teamServiceService = teamServiceService;
  }

  /**
   * @swagger
   * /api/v1/team-services:
   *   post:
   *     summary: Assign a service to a team
   *     tags: [TeamServices]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - team_id
   *               - service_id
   *             properties:
   *               team_id:
   *                 type: string
   *               service_id:
   *                 type: string
   *     responses:
   *       201:
   *         description: Service assigned to team successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreateTeamServiceRequest = req.body;
      const teamService = await this.teamServiceService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamService,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-services/{uid}:
   *   get:
   *     summary: Get team service assignment by ID
   *     tags: [TeamServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Team service ID
   *     responses:
   *       200:
   *         description: Team service details
   *       404:
   *         description: Team service not found
   */
  @Get("/:uid")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const teamService = await this.teamServiceService.findById(uid);

      if (!teamService) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team service not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamService,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-services:
   *   get:
   *     summary: Get all team service assignments
   *     tags: [TeamServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: team_id
   *         schema:
   *           type: string
   *         description: Filter by team ID
   *       - in: query
   *         name: service_id
   *         schema:
   *           type: string
   *         description: Filter by service ID
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
   *         description: List of team service assignments
   */
  @Get("/")
  public async findAll(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const team_id = req.query.team_id as string | undefined;
      const service_id = req.query.service_id as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const teamServices = await this.teamServiceService.findAll(
        team_id,
        service_id,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamServices,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-services/{uid}:
   *   delete:
   *     summary: Remove service assignment from team
   *     tags: [TeamServices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Team service ID
   *     responses:
   *       200:
   *         description: Team service deleted successfully
   *       404:
   *         description: Team service not found
   */
  @Delete("/:uid")
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.teamServiceService.delete(uid);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team service not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Team service deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
