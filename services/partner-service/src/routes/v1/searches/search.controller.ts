import {
  Request,
  Response,
  Controller,
  Get,
  utils,
  errors,
  Decorators,
} from "@giusmento/mangojs-core";
import { SearchService } from "../../../services/search.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

// Resolve service from container
const searchService = partnerContainer.get<SearchService>(SearchService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Searches
 *   description: Search endpoints for shops
 */
@Controller("/api/partner/v1/searches")
export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = searchService;
  }

  /**
   * @swagger
   * /api/partner/v1/searches/shops:
   *   get:
   *     summary: Search shops
   *     tags: [Searches]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: query
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Number of items per page
   *       - in: query
   *         name: userLocation
   *         schema:
   *           type: string
   *         description: User location for proximity search (format: "lat,lng")
   *     responses:
   *       200:
   *         description: Paginated list of shops matching the search query
   *       400:
   *         description: Bad request - missing query parameter
   */
  @Get("/shops")
  @Decorators.auth.NoAuth()
  public async searchShops(
    req: Request<
      PBTypes.partner.api.v1.searches.GET.Params,
      undefined,
      PBTypes.partner.api.v1.searches.GET.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.searches.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.searches.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { query, page = 1, limit = 20, location } = req.query;

      // Validate required query parameter
      if (!query || query.trim() === "") {
        throw new errors.APIError(
          400,
          "BAD_REQUEST",
          "Search query is required"
        );
      }

      const result = await this.searchService.searchShops({
        query,
        page: Number(page),
        limit: Number(limit),
        location,
      });

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: {
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          items: result.items,
        },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
