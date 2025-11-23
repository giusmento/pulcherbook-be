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
import { TeamMemberService } from "../../../services/team-member.service";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type TeamMemberPost = PBTypes.partner.entities.TeamMemberPost;
import { partnerContainer } from "../../../inversify.config";

// Resolve service from container
const teamMemberService = partnerContainer.get<TeamMemberService>(
  TeamMemberService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: TeamMembers
 *   description: Team member management endpoints
 */
@Controller("/api/v1/partners/:partner_uid/team-members")
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
  public async create(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.POST.Params,
      PBTypes.partner.api.v1.teamMembers.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teamMembers.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data = req.body;
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
   * /api/v1/team-members/{uid}:
   *   get:
   *     summary: Get team member by ID
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
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
  @Get("/:uid")
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.GET.ParamsSingle,
      PBTypes.partner.api.v1.teamMembers.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.GET.ResponseBodySingle>
  ): Promise<
    Response<PBTypes.partner.api.v1.teamMembers.GET.ResponseBodySingle>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const teamMember = await this.teamMemberService.findById(uid);

      if (!teamMember) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
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
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.GET.Params,
      PBTypes.partner.api.v1.teamMembers.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teamMembers.GET.ResponseBody>> {
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
   * /api/v1/team-members/{uid}:
   *   delete:
   *     summary: Delete team member
   *     tags: [TeamMembers]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
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
  @Delete("/:uid")
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.DELETE.Params,
      PBTypes.partner.api.v1.teamMembers.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teamMembers.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.teamMemberService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
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
}
