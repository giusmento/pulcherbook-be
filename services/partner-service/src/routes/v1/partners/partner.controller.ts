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
  Decorators,
} from "@giusmento/mangojs-core";
import { PartnerService } from "../../../services/partner.service";
import {
  CreatePartnerRequest,
  UpdatePartnerRequest,
  SearchPartnersRequest,
} from "../../../types/types";

// Resolve service from container
const partnerService = Containers.getContainer().get<PartnerService>(
  PartnerService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partner management endpoints
 */
@Controller("/api/v1/partners")
export class PartnerController {
  private partnerService: PartnerService;

  constructor() {
    this.partnerService = partnerService;
  }

  /**
   * @swagger
   * /api/v1/partners:
   *   post:
   *     summary: Create a new partner
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - owner_user_id
   *               - company_name
   *             properties:
   *               owner_user_id:
   *                 type: string
   *               company_name:
   *                 type: string
   *               description:
   *                 type: string
   *               address:
   *                 type: string
   *               city:
   *                 type: string
   *               state:
   *                 type: string
   *               country:
   *                 type: string
   *               postal_code:
   *                 type: string
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *               phone:
   *                 type: string
   *               email:
   *                 type: string
   *               website:
   *                 type: string
   *     responses:
   *       201:
   *         description: Partner created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreatePartnerRequest = req.body;
      const partner = await this.partnerService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: partner,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{uid}:
   *   get:
   *     summary: Get partner by ID
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Partner ID
   *     responses:
   *       200:
   *         description: Partner details
   *       404:
   *         description: Partner not found
   */
  @Get("/:uid")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const partner = await this.partnerService.findById(uid);

      if (!partner) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Partner not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: partner,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners:
   *   get:
   *     summary: Get all partners
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
   *         description: List of partners
   */
  @Get("/")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async findAll(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const partners = await this.partnerService.findAll(limit, offset);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: partners,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{uid}:
   *   put:
   *     summary: Update partner
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Partner ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               company_name:
   *                 type: string
   *               description:
   *                 type: string
   *               address:
   *                 type: string
   *               city:
   *                 type: string
   *               state:
   *                 type: string
   *               country:
   *                 type: string
   *               postal_code:
   *                 type: string
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *               phone:
   *                 type: string
   *               email:
   *                 type: string
   *               website:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Partner updated successfully
   *       404:
   *         description: Partner not found
   */
  @Put("/:uid")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async update(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: UpdatePartnerRequest = req.body;
      const partner = await this.partnerService.update(uid, data);

      if (!partner) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Partner not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: partner,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{uid}:
   *   delete:
   *     summary: Delete partner (soft delete)
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Partner ID
   *     responses:
   *       200:
   *         description: Partner deleted successfully
   *       404:
   *         description: Partner not found
   */
  @Delete("/:uid")
  @Decorators.auth.HasGroups(["Admin", "Partner"])
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.partnerService.delete(uid);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Partner not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Partner deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/search:
   *   post:
   *     summary: Search partners
   *     tags: [Partners]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               latitude:
   *                 type: number
   *               longitude:
   *                 type: number
   *               radius:
   *                 type: number
   *                 description: Search radius in kilometers
   *               service_id:
   *                 type: string
   *               city:
   *                 type: string
   *               limit:
   *                 type: integer
   *                 default: 20
   *               offset:
   *                 type: integer
   *                 default: 0
   *     responses:
   *       200:
   *         description: Search results
   */
  @Post("/search")
  @Decorators.auth.NoAuth()
  public async search(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const params: SearchPartnersRequest = req.body;
      const partners = await this.partnerService.search(params);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: partners,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{uid}/availability:
   *   get:
   *     summary: Get partner availability
   *     tags: [Partners]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Partner ID
   *     responses:
   *       200:
   *         description: Partner availability details
   *       404:
   *         description: Partner not found
   */
  @Get("/:uid/availability")
  public async getAvailability(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const availability = await this.partnerService.getAvailability(uid);

      if (!availability) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Partner not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: availability,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
