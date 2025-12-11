import { mappers } from "@giusmento/mangojs-core";
import * as models from "../db/models";
import * as PBTypes from "@giusmento/pulcherbook-types";

/**
 * Mapper for Shop entity to DTO transformation for search results
 */
export class SearchShopMapper extends mappers.BaseMapper<
  models.Shop,
  PBTypes.partner.entities.SearchShop
> {
  /**
   * Maps a Shop entity to its DTO representation for search results
   * @param entity - The Shop entity from the database
   * @returns The mapped Shop DTO
   */
  toDTO(entity: models.Shop): PBTypes.partner.entities.SearchShop {
    return {
      uid: entity.uid,
      shopName: entity.shopName,
      description: entity.description || null,
      addressStreet: entity.addressStreet || null,
      addressCity: entity.addressCity || null,
      addressState: entity.addressState || null,
      addressCountry: entity.addressCountry || null,
      addressPostalCode: entity.addressPostalCode || null,
      latitude: entity.latitude || null,
      longitude: entity.longitude || null,
      phoneNumber: entity.phoneNumber || null,
      email: entity.email || null,
      website: entity.website || null,
      instagram: entity.instagram || null,
      status: entity.status,
      businessType: entity.businessType?.name || null,
      createdAt: entity.createdAt.toUTCString(),
      updatedAt: entity.updatedAt.toUTCString(),
    };
  }

  /**
   * Maps a SearchShop DTO to its entity representation
   * Not needed for this mapper
   * Kept for base class compliance
   */
  fromDTO(_dto: PBTypes.partner.entities.SearchShop): Partial<models.Shop> {
    throw new Error("fromDTO not implemented for SearchShopMapper");
  }
}
