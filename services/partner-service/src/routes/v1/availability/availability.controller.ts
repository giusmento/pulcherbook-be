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
import { AvailabilityService } from "../../../services/availability.service";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  GetAvailableSlotsRequest,
} from "../../../types/types";
import { partnerContainer } from "../../../inversify.config";

// Resolve service from container
const availabilityService = partnerContainer.get<AvailabilityService>(
  AvailabilityService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Team member availability management endpoints
 */
@Controller("/api/v1/availability")
export class AvailabilityController {
  private availabilityService: AvailabilityService;

  constructor() {
    this.availabilityService = availabilityService;
  }

  /**
   * @swagger
   * /api/v1/availability:
   *   post:
   *     summary: Create availability rule for a team member
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - team_member_id
   *               - is_recurring
   *               - start_time
   *               - end_time
   *             properties:
   *               team_member_id:
   *                 type: string
   *               is_recurring:
   *                 type: boolean
   *               day_of_week:
   *                 type: integer
   *                 minimum: 0
   *                 maximum: 6
   *                 description: Required if is_recurring is true (0=Sunday, 6=Saturday)
   *               specific_date:
   *                 type: string
   *                 format: date
   *                 description: Required if is_recurring is false
   *               start_time:
   *                 type: string
   *                 format: time
   *                 example: "09:00"
   *               end_time:
   *                 type: string
   *                 format: time
   *                 example: "17:00"
   *     responses:
   *       201:
   *         description: Availability created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CreateAvailabilityRequest = req.body;
      const availability = await this.availabilityService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: availability,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/availability/{uid}:
   *   get:
   *     summary: Get availability by ID
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Availability ID
   *     responses:
   *       200:
   *         description: Availability details
   *       404:
   *         description: Availability not found
   */
  @Get("/:uid")
  public async findById(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const availability = await this.availabilityService.findById(uid);

      if (!availability) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Availability not found",
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

  /**
   * @swagger
   * /api/v1/availability:
   *   get:
   *     summary: Get all availability rules
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: team_member_id
   *         schema:
   *           type: string
   *         description: Filter by team member ID
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
   *         description: List of availability rules
   */
  @Get("/")
  public async findAll(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const team_member_id = req.query.team_member_id as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const availabilities = await this.availabilityService.findAll(
        team_member_id,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: availabilities,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/availability/{uid}:
   *   put:
   *     summary: Update availability rule
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Availability ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               start_time:
   *                 type: string
   *                 format: time
   *               end_time:
   *                 type: string
   *                 format: time
   *               is_recurring:
   *                 type: boolean
   *               day_of_week:
   *                 type: integer
   *                 minimum: 0
   *                 maximum: 6
   *               specific_date:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Availability updated successfully
   *       404:
   *         description: Availability not found
   */
  @Put("/:uid")
  public async update(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: UpdateAvailabilityRequest = req.body;
      const availability = await this.availabilityService.update(uid, data);

      if (!availability) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Availability not found",
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

  /**
   * @swagger
   * /api/v1/availability/{uid}:
   *   delete:
   *     summary: Delete availability rule
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Availability ID
   *     responses:
   *       200:
   *         description: Availability deleted successfully
   *       404:
   *         description: Availability not found
   */
  @Delete("/:uid")
  public async delete(req: Request, res: Response): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.availabilityService.delete(uid);

      if (!success) {
        const apiResponse = {
          ok: false,
          timestamp: logRequest.timestamp,
          requestId: logRequest.requestId,
          error: "Availability not found",
        };
        return res.status(404).send(apiResponse);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Availability deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/availability/slots:
   *   post:
   *     summary: Get available time slots for a team member
   *     tags: [Availability]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - team_member_id
   *               - date
   *               - service_id
   *             properties:
   *               team_member_id:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date
   *               service_id:
   *                 type: string
   *     responses:
   *       200:
   *         description: Available time slots
   */
  @Post("/slots")
  public async getAvailableSlots(
    req: Request,
    res: Response
  ): Promise<Response> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: GetAvailableSlotsRequest = req.body;
      const slots = await this.availabilityService.getAvailableSlots(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: slots,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
