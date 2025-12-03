import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
} from "@giusmento/mangojs-core";
import { OfferingService } from "../../../services/offering.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type OfferingPost = PBTypes.partner.entities.OfferingPost;
type OfferingPut = PBTypes.partner.entities.OfferingPut;

// Resolve service from container
const offeringService = partnerContainer.get<OfferingService>(OfferingService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */
@Controller("/api/partner/v1/partners/:partnerUid/offerings")
export class OfferingController {
  private offeringService: OfferingService;

  constructor() {
    this.offeringService = offeringService;
  }

  /**
   * @swagger
   * /api/v1/services:
   *   post:
   *     summary: Create a new service
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - partner_id
   *               - name
   *               - duration_minutes
   *               - price
   *             properties:
   *               partner_id:
   *                 type: string
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               duration_minutes:
   *                 type: integer
   *               price:
   *                 type: number
   *               currency:
   *                 type: string
   *                 default: USD
   *     responses:
   *       201:
   *         description: Service created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(
    req: Request<
      PBTypes.partner.api.v1.offerings.POST.Params,
      PBTypes.partner.api.v1.offerings.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.offerings.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.offerings.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: OfferingPost = req.body;
      const service = await this.offeringService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: service,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/services/{uid}:
   *   get:
   *     summary: Get service by ID
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Service details
   *       404:
   *         description: Service not found
   */
  @Get("/:uid")
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.offerings.GET.ParamsSingle,
      PBTypes.partner.api.v1.offerings.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.offerings.GET.ResponseBodySingle>
  ): Promise<
    Response<PBTypes.partner.api.v1.offerings.GET.ResponseBodySingle>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const offering = await this.offeringService.findById(uid);

      if (!offering) {
        throw new errors.APIError(404, "NOT_FOUND", "Offering not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: offering,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/services:
   *   get:
   *     summary: Get all services
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: partner_id
   *         schema:
   *           type: string
   *         description: Filter by partner ID
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
   *         description: List of services
   */
  @Get("/")
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.offerings.GET.Params,
      PBTypes.partner.api.v1.offerings.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.offerings.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.offerings.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const partnerUid = req.params.partnerUid;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const offerings = await this.offeringService.findAll(
        partnerUid,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: offerings,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/services/{uid}:
   *   put:
   *     summary: Update service
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Service ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               duration_minutes:
   *                 type: integer
   *               price:
   *                 type: number
   *               currency:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Service updated successfully
   *       404:
   *         description: Service not found
   */
  @Put("/:uid")
  public async update(
    req: Request<
      PBTypes.partner.api.v1.offerings.PUT.Params,
      PBTypes.partner.api.v1.offerings.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.offerings.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.offerings.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: OfferingPut = req.body;
      const offering = await this.offeringService.update(uid, data);

      if (!offering) {
        throw new errors.APIError(404, "NOT_FOUND", "Offering not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: offering,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/services/{uid}:
   *   delete:
   *     summary: Delete service
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Service deleted successfully
   *       404:
   *         description: Service not found
   */
  @Delete("/:uid")
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.offerings.DELETE.Params,
      PBTypes.partner.api.v1.offerings.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.offerings.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.offerings.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.offeringService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Offering not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Service deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
