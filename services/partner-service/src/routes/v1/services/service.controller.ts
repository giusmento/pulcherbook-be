import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
  Containers,
} from "@giusmento/mangojs-core";
import { ServiceService } from "../../../services/service.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type ServicePost = PBTypes.partner.entities.ServicePost;
type ServicePut = PBTypes.partner.entities.ServicePut;

// Resolve service from container
const serviceService = partnerContainer.get<ServiceService>(ServiceService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */
@Controller("/api/v1/services")
export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = serviceService;
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
      PBTypes.partner.api.v1.services.POST.Params,
      PBTypes.partner.api.v1.services.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.services.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.services.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: ServicePost = req.body;
      const service = await this.serviceService.create(data);

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
      PBTypes.partner.api.v1.services.GET.ParamsSingle,
      PBTypes.partner.api.v1.services.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.services.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.services.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const service = await this.serviceService.findById(uid);

      if (!service) {
        throw new errors.APIError(404, "NOT_FOUND", "Service not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: service,
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
      PBTypes.partner.api.v1.services.GET.Params,
      PBTypes.partner.api.v1.services.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.services.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.services.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const partnerId = req.query.partnerId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const services = await this.serviceService.findAll(
        partnerId,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: services,
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
      PBTypes.partner.api.v1.services.PUT.Params,
      PBTypes.partner.api.v1.services.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.services.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.services.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: ServicePut = req.body;
      const service = await this.serviceService.update(uid, data);

      if (!service) {
        throw new errors.APIError(404, "NOT_FOUND", "Service not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: service,
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
      PBTypes.partner.api.v1.services.DELETE.Params,
      PBTypes.partner.api.v1.services.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.services.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.services.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.serviceService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Service not found");
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
