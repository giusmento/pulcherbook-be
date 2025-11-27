import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import { IAMClientService } from "./iam-client.service";

import type * as PBTypes from "@giusmento/pulcherbook-types";

type CreateTeamMemberRequest =
  PBTypes.partner.requests.teamMember.CreateTeamMemberRequest;

@injectable()
export class TeamMemberService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  @inject(IAMClientService)
  private _iamClient: IAMClientService;

  constructor() {}

  /**
   * Create Team Member - Create a new team member with validation
   *
   * @param data - Team member creation data
   * @returns Promise resolving to the created team member
   * @throws {APIError} 400 BAD_REQUEST if validation fails
   * @throws {APIError} 503 SERVICE_UNAVAILABLE if IAM service is down
   */
  public async create(
    partnerExternalUid: string,
    userExternalUid: string,
    data: CreateTeamMemberRequest
  ): Promise<PBTypes.partner.entities.TeamMember> {
    // Validation
    if (!data.firstName || !data.lastName) {
      throw new errors.APIError(
        400,
        "BAD_REQUEST",
        "First name and last name are required"
      );
    }
    if (!data.email) {
      throw new errors.APIError(400, "BAD_REQUEST", "Email is required");
    }

    // Move to controller to get cookies from request
    // Step 1: Create user in IAM service first
    //const iamUser = {
    //  email: data.email,
    //  firstName: data.firstName,
    //  lastName: data.lastName,
    //  groups: [],
    //};
    //let iamUserResponse: { uid: string; email: string };
    //// TODO move to controller to get cookies from request
    //try {
    //  iamUserResponse = await this._iamClient.createPartnerUser(
    //    partner_uid,
    //    iamUser,
    //    {}
    //  );
    //} catch (error) {
    //  console.error("[TeamMemberService] Failed to create IAM user:", error);
    //  throw error; // Re-throw IAM errors
    //}

    // Step 2: Create team member in partner service with IAM user UID
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMemberData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          externalUid: userExternalUid, // Link to IAM user
        };
        // get partner
        const partner = await em.findOne(models.Partner, {
          where: { externalUid: partnerExternalUid },
        });
        if (!partner) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Invalid partnerUid, partner does not exist"
          );
        }
        // add partner relation
        teamMemberData["partner"] = partner;

        const teamMember = em.create(models.TeamMember, teamMemberData);
        await em.save(teamMember);
        return teamMember;
      }
    );
    return response as PBTypes.partner.entities.TeamMember;
  }

  /**
   * Modify Team Member - Modify an existing team member with validation
   *
   * @param data - Team member creation data
   * @returns Promise resolving to the created team member
   * @throws {APIError} 400 BAD_REQUEST if validation fails
   * @throws {APIError} 503 SERVICE_UNAVAILABLE if IAM service is down
   */
  public async modify(
    data: CreateTeamMemberRequest,
    uid: string,
    partner_uid: string
  ): Promise<PBTypes.partner.entities.TeamMember> {
    // Validationß

    // Step 2: Create team member in partner service with IAM user UID
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, {
          where: { uid },
        });
        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        Object.assign(teamMember, data);
        await em.save(teamMember);

        return teamMember;
      }
    );
    return response as PBTypes.partner.entities.TeamMember;
  }

  /**
   * Get Team Member By ID - Retrieve a team member by their ID with relations
   *
   * @param uid - Team member ID
   * @returns Promise resolving to the team member with team, partner, appointments, and availabilities
   * @throws {APIError} 404 NOT_FOUND if team member doesn't exist
   */
  public async findById(
    partner_uid: string,
    uid: string
  ): Promise<PBTypes.partner.entities.TeamMember> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, {
          where: { uid },
        });

        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        return teamMember;
      }
    );
    return response as PBTypes.partner.entities.TeamMember;
  }

  /**
   * Get All Team Members - Retrieve all team members with optional filtering by team
   *
   * @param team_id - Optional team ID to filter by
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of team members
   */
  public async findAll(
    partner_uid: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PBTypes.partner.entities.PartnerTeamMember[]> {
    // get users from iam service
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teams = await em.find(models.TeamMember, {
          where: { partner: { externalUid: partner_uid } },
          relations: ["teams"],
        });
        if (!teams) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }
        // map out teams
        const response = teams.map((team) => {
          return {
            uid: team.uid,
            externalUid: team.externalUid,
            teams: team.teams.map((t) => ({ uid: t.uid, name: t.name })),
            joinedAt: team.joinedAt,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
          };
        });
        return response;
      }
    );
    return response as PBTypes.partner.entities.PartnerTeamMember[];
  }

  /**
   * Update Groups - Update the groups assigned to a partner user
   *
   * @param uid - The user's uid
   * @param document - Object containing groups to add, remove, or set
   * @returns Promise resolving to the updated user object
   * @throws {APIError} 404 NOT_FOUND if the user does not exist
   * @description Allows adding, removing, or setting groups for the user. Only one operation can be performed at a time.
   */
  public async updateGroups(
    uid: string,
    document: PBTypes.partner.entities.TeamManageForUser
  ): Promise<PBTypes.partner.entities.PartnerTeamMember> {
    // validate input
    if (
      !document ||
      (document.add === undefined &&
        document.remove === undefined &&
        document.set === undefined)
    ) {
      throw new errors.APIError(
        400,
        "BAD_REQUEST",
        "No groups provided for update"
      );
    }
    // reject if more than one operation is provided
    const operations = [
      document.add ? 1 : 0,
      document.remove ? 1 : 0,
      document.set ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
    if (operations !== 1) {
      throw new errors.APIError(
        400,
        "BAD_REQUEST",
        "Only one operation (add, remove, set) can be performed at a time"
      );
    }

    const response = (await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // get all groups entities in the request
        const allGroupUids: string[] = [];
        if (document.add) {
          allGroupUids.push(...document.add);
        }
        if (document.remove) {
          allGroupUids.push(...document.remove);
        }
        if (document.set) {
          allGroupUids.push(...document.set);
        }

        // fetch group entities
        const groups = await em
          .getRepository(models.Team)
          .createQueryBuilder("group")
          .where("uid IN (:...uids)", {
            uids: allGroupUids,
          })
          .getMany();

        if (groups.length === 0) {
          throw new errors.APIError(404, "NOT_FOUND", "No groups found");
        }

        // find admin user
        const user = await em.findOne(models.TeamMember, {
          where: { uid },
          relations: ["teams"],
        });

        if (!user) {
          throw new errors.APIError(404, "NOT_FOUND", "User not found");
        }

        // update groups based on operation
        if (document.add) {
          const groupsToAdd = groups.filter((g) =>
            document.add!.includes(g.uid)
          );
          user.teams = Array.from(
            new Set([...(user.teams || []), ...groupsToAdd])
          );
        } else if (document.remove) {
          const groupsToRemoveUids = new Set(document.remove);
          user.teams = (user.teams || []).filter(
            (g) => !groupsToRemoveUids.has(g.uid)
          );
        } else if (document.set) {
          const groupsToSet = groups.filter((g) =>
            document.set!.includes(g.uid)
          );
          user.teams = groupsToSet;
        }

        // save updated user
        const updateResult = await em.save(user);
        return updateResult;
      }
    )) as PBTypes.partner.entities.PartnerTeamMember;
    return response;
  }

  /**
   * Delete Team Member - Remove a team member (hard delete)
   *
   * @param uid - Team member ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if team member doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const teamMember = await em.findOne(models.TeamMember, {
          where: { uid },
        });
        if (!teamMember) {
          throw new errors.APIError(404, "NOT_FOUND", "Team member not found");
        }

        // Store externalUid before deletion
        const externalUid = teamMember.externalUid;

        // Delete team member from partner service
        await em.remove(teamMember);

        // TODO move to controller to get cookies from request
        // Delete user from IAM service (best effort, log if fails)
        if (externalUid) {
          try {
            const partner_uid = "";
            await this._iamClient.deletePartnerUser(
              partner_uid,
              externalUid,
              {}
            );
          } catch (error) {
            console.error(
              "[TeamMemberService] Failed to delete IAM user, but team member deleted:",
              error
            );
            // Don't throw - team member is already deleted
          }
        }

        return true;
      }
    );
    return response as boolean;
  }
}
