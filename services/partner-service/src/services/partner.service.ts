import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager } from "typeorm";
import {
  errors,
  INVERSITY_TYPES,
  IPersistenceContext,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import {
  CreatePartnerRequest,
  UpdatePartnerRequest,
  SearchPartnersRequest,
  ProfileCompletionResponse,
} from "../types/types";
import * as enums from "../catalog/enums";

@injectable()
export class PartnerService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  constructor() {}

  /**
   * Create Partner - Create a new partner with validation
   *
   * @param data - Partner creation data
   * @returns Promise resolving to the created partner
   * @throws {APIError} 400 BAD_REQUEST if company name or owner user ID is missing
   */
  public async create(data: CreatePartnerRequest): Promise<models.Partner> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Validation
        if (!data.company_name) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Company name is required"
          );
        }
        if (!data.owner_user_id) {
          throw new errors.APIError(
            400,
            "BAD_REQUEST",
            "Owner user ID is required"
          );
        }

        // Create and save using em
        const partner = em.create(models.Partner, data);
        await em.save(partner);
        return partner;
      }
    );
    return response as models.Partner;
  }

  /**
   * Get Partner By ID - Retrieve a partner by their ID with relations
   *
   * @param uid - Partner ID
   * @returns Promise resolving to the partner with teams, services, and media
   * @throws {APIError} 404 NOT_FOUND if partner doesn't exist
   */
  public async findById(uid: string): Promise<models.Partner> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const partner = await em.findOne(models.Partner, {
          where: { uid },
          relations: ["teams", "services", "media"],
        });

        if (!partner) {
          throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
        }

        return partner;
      }
    );
    return response as models.Partner;
  }

  /**
   * Get All Partners - Retrieve all partners with pagination
   *
   * @param limit - Number of items to return (default: 20)
   * @param offset - Number of items to skip (default: 0)
   * @returns Promise resolving to array of partners
   */
  public async findAll(
    limit: number = 20,
    offset: number = 0
  ): Promise<models.Partner[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        return await em.find(models.Partner, {
          take: limit,
          skip: offset,
          relations: ["teams", "services", "media"],
        });
      }
    );
    return response as models.Partner[];
  }

  /**
   * Update Partner - Update partner information
   *
   * @param uid - Partner ID
   * @param data - Fields to update
   * @returns Promise resolving to updated partner
   * @throws {APIError} 404 NOT_FOUND if partner doesn't exist
   */
  public async update(
    uid: string,
    data: UpdatePartnerRequest
  ): Promise<models.Partner> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const partner = await em.findOne(models.Partner, { where: { uid } });
        if (!partner) {
          throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
        }

        Object.assign(partner, data);
        await em.save(partner);
        return partner;
      }
    );
    return response as models.Partner;
  }

  /**
   * Delete Partner - Soft delete a partner by setting status to INACTIVE
   *
   * @param uid - Partner ID
   * @returns Promise resolving to true if successful
   * @throws {APIError} 404 NOT_FOUND if partner doesn't exist
   */
  public async delete(uid: string): Promise<boolean> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const partner = await em.findOne(models.Partner, { where: { uid } });
        if (!partner) {
          throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
        }

        // Soft delete - set status to inactive
        partner.status = enums.PartnerStatus.INACTIVE;
        await em.save(partner);
        return true;
      }
    );
    return response as boolean;
  }

  /**
   * Search Partners - Search for partners by location, city, or service
   *
   * @param params - Search parameters (latitude, longitude, radius, service_id, city, limit, offset)
   * @returns Promise resolving to array of matching partners
   */
  public async search(
    params: SearchPartnersRequest
  ): Promise<models.Partner[]> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const query = em
          .createQueryBuilder(models.Partner, "partner")
          .leftJoinAndSelect("partner.services", "service")
          .leftJoinAndSelect("partner.media", "media")
          .where("partner.status = :status", {
            status: enums.PartnerStatus.ACTIVE,
          });

        if (params.city) {
          query.andWhere("LOWER(partner.city) = LOWER(:city)", {
            city: params.city,
          });
        }

        if (params.service_id) {
          query.andWhere("service.uid = :serviceId", {
            serviceId: params.service_id,
          });
        }

        // Location-based search
        if (params.latitude && params.longitude && params.radius) {
          const { latitude, longitude, radius } = params;
          // Haversine formula for distance calculation
          query.andWhere(
            `(
              6371 * acos(
                cos(radians(:lat)) * cos(radians(partner.latitude)) *
                cos(radians(partner.longitude) - radians(:lon)) +
                sin(radians(:lat)) * sin(radians(partner.latitude))
              )
            ) <= :radius`,
            { lat: latitude, lon: longitude, radius }
          );
        }

        query.take(params.limit || 20).skip(params.offset || 0);

        return await query.getMany();
      }
    );
    return response as models.Partner[];
  }

  /**
   * Get Partner Availability - Get availability data for a partner including teams and members
   *
   * @param partnerUid - Partner ID
   * @returns Promise resolving to partner availability data with teams, services, and member availability
   * @throws {APIError} 404 NOT_FOUND if partner doesn't exist
   */
  public async getAvailability(partnerUid: string): Promise<any> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        const partner = await em.findOne(models.Partner, {
          where: { uid: partnerUid },
          relations: [
            "teams",
            "teams.members",
            "teams.members.availabilities",
            "teams.teamServices",
            "teams.teamServices.service",
          ],
        });

        if (!partner) {
          throw new errors.APIError(404, "NOT_FOUND", "Partner not found");
        }

        // Structure the availability data
        return {
          partner: {
            uid: partner.uid,
            company_name: partner.company_name,
          },
          teams: partner.teams.map((team) => ({
            uid: team.uid,
            name: team.name,
            services: team.teamServices.map((ts) => ts.service),
            members: team.members.map((member) => ({
              uid: member.uid,
              user_id: member.user_id,
              role: member.role,
              availabilities: member.availabilities,
            })),
          })),
        };
      }
    );
    return response;
  }

  /**
   * Check Profile Completion - Verify if partner profile has all required information
   *
   * @param uid - Partner ID
   * @returns Promise resolving to completion status with list of missing fields (if any)
   * @throws {APIError} 404 NOT_FOUND if partner doesn't exist
   */
  public async checkProfileCompletion(
    uid: string
  ): Promise<ProfileCompletionResponse> {
    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Define required fields for a complete profile
        const requiredFields: Array<{
          field: keyof models.Partner;
          label: string;
        }> = [
          { field: "description", label: "description" },
          { field: "phone", label: "phone" },
          { field: "email", label: "email" },
          { field: "address", label: "address" },
          { field: "city", label: "city" },
          { field: "country", label: "country" },
          { field: "postal_code", label: "postal_code" },
        ];

        const partner = await em.findOne(models.Partner, {
          where: { uid },
        });

        if (!partner) {
          return {
            isCompleted: false,
            missingFields: requiredFields.map((f) => f.label),
          };
        }

        // Check for missing fields
        const missingFields: string[] = [];
        for (const { field, label } of requiredFields) {
          const value = partner[field];
          if (!value || (typeof value === "string" && value.trim() === "")) {
            missingFields.push(label);
          }
        }

        return {
          isCompleted: missingFields.length === 0,
          missingFields: missingFields.length > 0 ? missingFields : undefined,
        };
      }
    );
    return response as ProfileCompletionResponse;
  }
}
