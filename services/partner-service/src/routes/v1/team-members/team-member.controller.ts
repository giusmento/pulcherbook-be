import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Delete,
  utils,
  errors,
} from "@giusmento/mangojs-core";
import { PartnerContainer } from "../../../inversify.config";
import { TeamMemberService } from "../../../service/team-member.service";
import { CreateTeamMemberRequest } from "../../../types/types";

// Resolve service from container
const teamMemberService = PartnerContainer.get<TeamMemberService>(TeamMemberService);

/**
 * @swagger
 * tags:
 *   name: TeamMembers
 *   description: Team member management endpoints
 */
@Controller("/api/v1/team-members")
export class TeamMemberController {
  private teamMemberService: TeamMemberService;

  constructor() {
    this.teamMemberService = teamMemberService;
  }

  /**
   * @swagger
   * /api/v1/team-members:
   *   post:
   *     summary: Create a new team member
   *     tags: [TeamMembers]
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
   *               - user_id
   *             properties:
   *               team_id:
   *                 type: string
   *               user_id:
   *                 type: string
   *               role:
   *                 type: string
   *     responses:
   *       201:
   *         description: Team member created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreateTeamMemberRequest = req.body;
      const teamMember = await this.teamMemberService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamMember,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members/{id}:
   *   get:
   *     summary: Get team member by ID
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Team member ID
   *     responses:
   *       200:
   *         description: Team member details
   *       404:
   *         description: Team member not found
   */
  @Get("/:id")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const teamMember = await this.teamMemberService.findById(id);

      if (!teamMember) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team member not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamMember,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members:
   *   get:
   *     summary: Get all team members
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: team_id
   *         schema:
   *           type: string
   *         description: Filter by team ID
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
   *         description: List of team members
   */
  @Get("/")
  public async findAll(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const team_id = req.query.team_id as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const teamMembers = await this.teamMemberService.findAll(
        team_id,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: teamMembers,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members/{id}:
   *   delete:
   *     summary: Delete team member
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Team member ID
   *     responses:
   *       200:
   *         description: Team member deleted successfully
   *       404:
   *         description: Team member not found
   */
  @Delete("/:id")
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const success = await this.teamMemberService.delete(id);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team member not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Team member deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members/{id}/upcoming-appointments:
   *   get:
   *     summary: Get upcoming appointments for a team member
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Team member ID
   *     responses:
   *       200:
   *         description: Upcoming appointments
   *       404:
   *         description: Team member not found
   */
  @Get("/:id/upcoming-appointments")
  public async getUpcomingAppointments(
    req: Request,
    res: Response
  ): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const appointments =
        await this.teamMemberService.getUpcomingAppointments(id);

      if (!appointments) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Team member not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointments,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
