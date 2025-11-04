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
import { PartnerContainer } from "../../../inversify.config";
import { ServiceService } from "../../../service/service.service";
import {
  CreateServiceRequest,
  UpdateServiceRequest,
} from "../../../types/types";

// Resolve service from container
const serviceService = PartnerContainer.get<ServiceService>(ServiceService);

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
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreateServiceRequest = req.body;
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
   * /api/v1/services/{id}:
   *   get:
   *     summary: Get service by ID
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Get("/:id")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const service = await this.serviceService.findById(id);

      if (!service) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Service not found",
        };
        return res.status(404).send(apiResponse);
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
  public async findAll(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const partner_id = req.query.partner_id as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const services = await this.serviceService.findAll(
        partner_id,
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
   * /api/v1/services/{id}:
   *   put:
   *     summary: Update service
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Put("/:id")
  public async update(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const data: UpdateServiceRequest = req.body;
      const service = await this.serviceService.update(id, data);

      if (!service) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Service not found",
        };
        return res.status(404).send(apiResponse);
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
   * /api/v1/services/{id}:
   *   delete:
   *     summary: Delete service
   *     tags: [Services]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  @Delete("/:id")
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { id } = req.params;
      const success = await this.serviceService.delete(id);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Service not found",
        };
        return res.status(404).send(apiResponse);
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
