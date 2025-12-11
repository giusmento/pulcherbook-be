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

        // Build search query
        const queryBuilder = em.createQueryBuilder(models.Shop, "shop");

        // search in multiple fields if query is not empty
        if (!query && query !== undefined) {
          const searchPattern = `%${query}%`;
          // Create query builder for more complex search
          queryBuilder
            .leftJoinAndSelect("shop.businessType", "businessType")
            .where(
              "shop.shopName ILIKE :search OR " +
                "shop.description ILIKE :search OR " +
                "shop.addressStreet ILIKE :search OR " +
                "shop.addressCity ILIKE :search OR " +
                "shop.addressCountry ILIKE :search",
              { search: searchPattern }
            );
        }
        // search services if provided
        //if (params.service) {
        //  queryBuilder.andWhere("shop.businessType.name ILIKE :service", {
        //    service: `%${params.service}%`,
        //  });
        //}

        // Exclude shops with 'online' status
        queryBuilder.andWhere("shop.status = :onLineStatus", {
          onLineStatus: "online",
        });

        // add bounding box filter if provided
        if (params.neLat && params.neLng && params.swLat && params.swLng) {
          queryBuilder.andWhere(
            "shop.latitude BETWEEN :swLat AND :neLat AND shop.longitude BETWEEN :swLng AND :neLng",
            {
              neLat: params.neLat,
              neLng: params.neLng,
              swLat: params.swLat,
              swLng: params.swLng,
            }
          );
        }
        // Default ordering by the center of the bounding box if location provided
        // calculate the center of the bounding box
        const centerBounding =
          params.neLat && params.neLng && params.swLat && params.swLng
            ? {
                lat: (Number(params.neLat) + Number(params.swLat)) / 2,
                lng: (Number(params.neLng) + Number(params.swLng)) / 2,
              }
            : null;

        if (centerBounding && centerBounding.lat && centerBounding.lng) {
          queryBuilder.addSelect(
            `SQRT(POWER((shop.latitude - :centerLat), 2) + POWER((shop.longitude - :centerLng), 2))`,
            "distance"
          );
          queryBuilder.setParameters({
            centerLat: centerBounding.lat,
            centerLng: centerBounding.lng,
          });
          queryBuilder.orderBy("distance", "ASC");
        } else {
          // Default ordering by shop name
          queryBuilder.orderBy("shop.shopName", "ASC");
        }

        // Apply pagination
        queryBuilder.skip(offset).take(limit);

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
