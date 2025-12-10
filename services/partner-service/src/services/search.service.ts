import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { EntityManager, Like, ILike } from "typeorm";
import {
  INVERSITY_TYPES,
  IPersistenceContext,
  Types,
} from "@giusmento/mangojs-core";
import * as models from "../db/models";
import type * as PBTypes from "@giusmento/pulcherbook-types";
import { SearchShopMapper } from "../mappers";

@injectable()
export class SearchService {
  @inject(new LazyServiceIdentifier(() => INVERSITY_TYPES.PersistenceContext))
  private _persistenceContext: IPersistenceContext;

  private readonly searchShopMapper = new SearchShopMapper();

  constructor() {}

  /**
   * Search Shops - Search shops by name, description, address, city, or country
   *
   * @param params - Search parameters including query, pagination, and optional user location
   * @returns Promise resolving to paginated search results
   */
  public async searchShops(
    params: PBTypes.partner.api.v1.searches.GET.QueryParams
  ): Promise<Types.v1.api.PaginatedData<PBTypes.partner.entities.SearchShop>> {
    const { query, page, limit, location } = params;

    const response = await this._persistenceContext.inTransaction(
      async (em: EntityManager) => {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build search query - search in multiple fields
        const searchPattern = `%${query}%`;

        // Create query builder for more complex search
        const queryBuilder = em
          .createQueryBuilder(models.Shop, "shop")
          .leftJoinAndSelect("shop.businessType", "businessType")
          .where(
            "shop.shopName ILIKE :search OR " +
              "shop.description ILIKE :search OR " +
              "shop.addressStreet ILIKE :search OR " +
              "shop.addressCity ILIKE :search OR " +
              "shop.addressCountry ILIKE :search",
            { search: searchPattern }
          )
          .andWhere("shop.status != :onLineStatus", {
            onLineStatus: "online",
          })
          .skip(offset)
          .take(limit);

        // If location is provided, order by distance (simple implementation)
        // For production, you might want to use PostGIS or similar for accurate geospatial queries
        if (location) {
          const [lat, lng] = location.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            // Add distance calculation (simplified - using Euclidean distance)
            // For production, consider using ST_Distance with PostGIS
            queryBuilder.addSelect(
              `SQRT(POW(69.1 * (shop.latitude - :lat), 2) + POW(69.1 * (:lng - shop.longitude) * COS(shop.latitude / 57.3), 2))`,
              "distance"
            );
            queryBuilder.setParameter("lat", lat);
            queryBuilder.setParameter("lng", lng);
            queryBuilder.orderBy("distance", "ASC");
          }
        } else {
          // Default ordering by shop name
          queryBuilder.orderBy("shop.shopName", "ASC");
        }

        // Execute query
        const [shops, total] = await queryBuilder.getManyAndCount();

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return {
          items: this.searchShopMapper.toDTOList(shops),
          totalItems: total,
          totalPages: totalPages,
          currentPage: page,
        };
      }
    );

    return response as Types.v1.api.PaginatedData<PBTypes.partner.entities.SearchShop>;
  }
}
