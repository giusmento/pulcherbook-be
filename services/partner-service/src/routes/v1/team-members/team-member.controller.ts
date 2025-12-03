import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Delete,
  utils,
  errors,
  Containers,
  Put,
} from "@giusmento/mangojs-core";
import { TeamMemberService } from "../../../services/team-member.service";
import { IAMClientService } from "../../../services/iam-client.service";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

import { partnerContainer } from "../../../inversify.config";

// Resolve service from container
const teamMemberService = partnerContainer.get<TeamMemberService>(
  TeamMemberService,
  {
    autobind: true,
  }
);
// Resolve service from container
const iamClientService = partnerContainer.get<IAMClientService>(
  IAMClientService,
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
@Controller("/api/partner/v1/partners/:partnerUid/team-members")
export class TeamMemberController {
  private teamMemberService: TeamMemberService;
  private _iamClient: IAMClientService;

  constructor() {
    this.teamMemberService = teamMemberService;
    this._iamClient = iamClientService;
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
      const partnerUid = req.params.partnerUid;
      // call iam to create partner user
      const iamUser = await this._iamClient.createPartnerUser(
        partnerUid,
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          groups: [],
        },
        req.cookies
      );
      // create user in partner service
      const teamMember = await this.teamMemberService.create(
        partnerUid,
        iamUser.uid,
        data
      );

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
      const { uid, partnerUid } = req.params;
      const teamMember = await this.teamMemberService.findById(partnerUid, uid);

      if (!teamMember) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
      }
      const iamTeamMembers = await this._iamClient.getPartnerUserByUid(
        partnerUid,
        teamMember.externalUid,
        req.cookies
      );
      const mergedTeamMember = {
        uid: teamMember.uid,
        firstName: iamTeamMembers.firstName,
        lastName: iamTeamMembers.lastName,
        email: iamTeamMembers.email,
        status: iamTeamMembers.status,
        phone: iamTeamMembers.phoneNumber || "",
        teams: teamMember.teams,
        systemGroups: [],
        externalUid: iamTeamMembers.uid,
        joinedAt: teamMember.joinedAt,
        createdAt: teamMember.createdAt,
        updatedAt: teamMember.updatedAt,
      };

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: mergedTeamMember,
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
      const teamId = req.query.teamId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const iamTeamMembers = await this._iamClient.getPartnerUsers(
        req.params.partnerUid,
        req.cookies
      );

      const partnerTeamMember = await this.teamMemberService.findAll(
        req.params.partnerUid
      );

      //merge data from iamTeamMembers and partnerTeamMember
      const mergeTeamMembers = iamTeamMembers.map((iamMember) => {
        const partnerMember = partnerTeamMember.find(
          (ptm) => ptm.externalUid === iamMember.uid
        );
        return {
          uid: partnerMember ? partnerMember.uid : "",
          firstName: iamMember.firstName,
          lastName: iamMember.lastName,
          email: iamMember.email,
          status: iamMember.status,
          teams: partnerMember ? partnerMember.teams : [],
          systemGroups: iamMember.groups.map((group) => ({
            uid: group.uid,
            name: group.name,
          })),
          phone: iamMember.phoneNumber || "",
          externalUid: iamMember.uid,
          joinedAt: partnerMember ? partnerMember.joinedAt : "",
          createdAt: partnerMember
            ? partnerMember.createdAt
            : String(iamMember.createdAt),
          updatedAt: partnerMember
            ? partnerMember.updatedAt
            : String(iamMember.updatedAt),
        };
      });

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: mergeTeamMembers,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members/{uid}:
   *   put:
   *     summary: MOdify team member
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
  @Put("/:uid")
  public async modify(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.PUT.Params,
      PBTypes.partner.api.v1.teamMembers.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.teamMembers.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const { partnerUid } = req.params;
      const data = req.body;

      const teamMember = await this.teamMemberService.modify(
        data,
        uid,
        partnerUid
      );

      if (!teamMember) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
      }

      // update data on IAM service
      const response = await this._iamClient.updatePartnerUser(
        partnerUid,
        teamMember.externalUid,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phone,
        },
        req.cookies
      );
      if (!response) {
        throw new errors.APIError(
          404,
          "NOT_FOUND",
          "Team member not found in IAM service"
        );
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: data,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/team-members/{uid}/groups:
   *   put:
   *     summary: manage team member groups
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
   *         description: Group assignments updated successfully
   *       404:
   *         description: Group or Team member not found
   */
  @Put("/:uid/groups")
  public async manageWorkingGroupsToTeamMember(
    req: Request<
      PBTypes.partner.api.v1.teamMembers.groups.PUT.Params,
      PBTypes.partner.api.v1.teamMembers.groups.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.teamMembers.groups.PUT.ResponseBody>
  ): Promise<
    Response<PBTypes.partner.api.v1.teamMembers.groups.PUT.ResponseBody>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const { partnerUid } = req.params;
      const data = req.body;

      const teamMember = await this.teamMemberService.updateGroups(uid, data);

      if (!teamMember) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { data, ok: true },
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
      const { partnerUid, uid } = req.params;

      // soft delete team member in partner service
      const teamMember = await this.teamMemberService.softDelete(uid);

      if (!teamMember) {
        throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
      }
      // delete user from iam is handled in service
      await this._iamClient.deletePartnerUser(
        partnerUid,
        teamMember.externalUid,
        req.cookies
      );

      // hard delete
      await this.teamMemberService.delete(uid);

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
