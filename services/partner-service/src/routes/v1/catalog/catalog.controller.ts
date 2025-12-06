import { Request, Response } from "express";
import {
  Controller,
  Get,
  utils,
  errors,
  Decorators,
} from "@giusmento/mangojs-core";
import { CatalogService } from "../../../services/catalog.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

// Resolve service from container
const catalogService = partnerContainer.get<CatalogService>(CatalogService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Catalog data endpoints
 */
@Controller("/api/partner/v1/catalog")
export class CatalogController {
  private catalogService: CatalogService;

  constructor() {
    this.catalogService = catalogService;
  }

  /**
   * @swagger
   * /api/v1/catalog/business-types:
   *   get:
   *     summary: Get all business types
   *     tags: [Catalog]
   *     responses:
   *       200:
   *         description: List of business types
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                 timestamp:
   *                   type: string
   *                 requestId:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       value:
   *                         type: string
   *                       label:
   *                         type: string
   */
  @Get("/business-types")
  @Decorators.auth.NoAuth()
  public async getBusinessTypes(
    req: Request<
      PBTypes.partner.api.v1.catalog.businessTypes.GET.Params,
      PBTypes.partner.api.v1.catalog.businessTypes.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.catalog.businessTypes.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.catalog.businessTypes.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const businessTypes = await this.catalogService.getBusinessTypes();

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: businessTypes,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/catalog/offering-categories:
   *   get:
   *     summary: Get all offering categories
   *     tags: [Catalog]
   *     responses:
   *       200:
   *         description: List of offering categories
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                 timestamp:
   *                   type: string
   *                 requestId:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       uid:
   *                         type: string
   *                       name:
   *                         type: string
   *                       description:
   *                         type: string
   *                       isActive:
   *                         type: boolean
   */
  @Get("/offering-categories")
  @Decorators.auth.NoAuth()
  public async getOfferingCategories(
    req: Request<
      PBTypes.partner.api.v1.catalog.offeringCategories.GET.Params,
      PBTypes.partner.api.v1.catalog.offeringCategories.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.catalog.offeringCategories.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.catalog.offeringCategories.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const offeringCategories =
        await this.catalogService.getOfferingCategories();

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: offeringCategories,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
