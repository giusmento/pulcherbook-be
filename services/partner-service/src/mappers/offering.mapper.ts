import { mappers } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import * as PBTypes from "@giusmento/pulcherbook-types";

/**
 * Mapper for Offering entity to DTO transformation
 */
export class OfferingMapper extends mappers.BaseMapper<
  models.Offering,
  PBTypes.partner.entities.Offering
> {
  /**
   * Maps an Offering entity to its DTO representation
   * @param entity - The Offering entity from the database
   * @returns The mapped Offering DTO
   */
  toDTO(entity: models.Offering): PBTypes.partner.entities.Offering {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description || null,
      durationMinutes: entity.durationMinutes,
      price: Number(entity.price),
      currency: entity.currency,
      status: entity.status,
      bookingAlgorithm: {
        name: entity.bookingAlgorithm,
      },
      isBookedOnline: entity.isBookedOnline,
      isRequiredConfirmation: entity.isRequiredConfirmation,
      isRequiredConsulting: entity.isRequiredConsulting,
      shops:
        entity.shops?.map((shop) => ({
          uid: shop.uid,
          name: shop.shopName,
        })) || [],
      teams:
        entity.teams?.map((team) => ({
          uid: team.uid,
          name: team.name,
        })) || [],
      category: entity.category
        ? {
            uid: entity.category.uid,
            name: entity.category.name,
          }
        : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps an Offering DTO to its entity representation
   * Not needed for this mapper as create/update use OfferingPost/OfferingPut types
   * Kept for base class compliance
   */
  fromDTO(_dto: PBTypes.partner.entities.Offering): Partial<models.Offering> {
    // Not implemented - not needed for offering operations
    throw new Error("fromDTO not implemented for OfferingMapper");
  }
}
