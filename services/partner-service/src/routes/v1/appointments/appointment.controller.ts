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
import { AppointmentService } from "../../../services/appointment.service";
import {
  UpdateAppointmentStatusRequest,
  CheckAvailabilityRequest,
} from "../../../types/types";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type AppointmentPost = PBTypes.partner.entities.AppointmentPost;
type AppointmentPut = PBTypes.partner.entities.AppointmentPut;

// Resolve service from container
const appointmentService = partnerContainer.get<AppointmentService>(
  AppointmentService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */
@Controller("/api/v1/appointments")
export class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = appointmentService;
  }

  /**
   * @swagger
   * /api/v1/appointments:
   *   post:
   *     summary: Create a new appointment
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customer_user_id
   *               - team_member_id
   *               - service_id
   *               - appointment_date
   *               - start_time
   *               - duration_minutes
   *             properties:
   *               customer_user_id:
   *                 type: string
   *               team_member_id:
   *                 type: string
   *               service_id:
   *                 type: string
   *               appointment_date:
   *                 type: string
   *                 format: date
   *                 example: "2024-01-15"
   *               start_time:
   *                 type: string
   *                 format: time
   *                 example: "14:30"
   *               duration_minutes:
   *                 type: integer
   *               customer_notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Appointment created successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(
    req: Request<
      PBTypes.partner.api.v1.appointments.POST.Params,
      PBTypes.partner.api.v1.appointments.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: AppointmentPost = req.body;
      const appointment = await this.appointmentService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointment,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments/{uid}:
   *   get:
   *     summary: Get appointment by ID
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Appointment ID
   *     responses:
   *       200:
   *         description: Appointment details
   *       404:
   *         description: Appointment not found
   */
  @Get("/:uid")
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.appointments.GET.ParamsSingle,
      PBTypes.partner.api.v1.appointments.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const appointment = await this.appointmentService.findById(uid);

      if (!appointment) {
        throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointment,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments:
   *   get:
   *     summary: Get all appointments
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: customer_user_id
   *         schema:
   *           type: string
   *         description: Filter by customer user ID
   *       - in: query
   *         name: team_member_id
   *         schema:
   *           type: string
   *         description: Filter by team member ID
   *       - in: query
   *         name: service_id
   *         schema:
   *           type: string
   *         description: Filter by service ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW]
   *         description: Filter by status
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
   *         description: List of appointments
   */
  @Get("/")
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.appointments.GET.Params,
      PBTypes.partner.api.v1.appointments.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const customerUserId = req.query.customerUserId as string | undefined;
      const teamMemberId = req.query.teamMemberId as string | undefined;
      const serviceId = req.query.serviceId as string | undefined;
      const status = req.query.status as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const appointments = await this.appointmentService.findAll(
        customerUserId,
        teamMemberId,
        serviceId,
        status,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointments,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments/{uid}:
   *   put:
   *     summary: Update appointment
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Appointment ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               appointment_date:
   *                 type: string
   *                 format: date
   *               start_time:
   *                 type: string
   *                 format: time
   *               duration_minutes:
   *                 type: integer
   *               customer_notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Appointment updated successfully
   *       404:
   *         description: Appointment not found
   */
  @Put("/:uid")
  public async update(
    req: Request<
      PBTypes.partner.api.v1.appointments.PUT.Params,
      PBTypes.partner.api.v1.appointments.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: AppointmentPut = req.body;
      const appointment = await this.appointmentService.update(uid, data);

      if (!appointment) {
        throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointment,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments/{uid}/status:
   *   put:
   *     summary: Update appointment status
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Appointment ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW]
   *               cancellation_reason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Appointment status updated successfully
   *       404:
   *         description: Appointment not found
   */
  @Put("/:uid/status")
  public async updateStatus(
    req: Request<
      PBTypes.partner.api.v1.appointments.status.PUT.Params,
      PBTypes.partner.api.v1.appointments.status.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.status.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.status.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: UpdateAppointmentStatusRequest = req.body;
      const appointment = await this.appointmentService.updateStatus(uid, data);

      if (!appointment) {
        throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: appointment,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments/{uid}:
   *   delete:
   *     summary: Delete appointment
   *     tags: [Appointments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Appointment ID
   *     responses:
   *       200:
   *         description: Appointment deleted successfully
   *       404:
   *         description: Appointment not found
   */
  @Delete("/:uid")
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.appointments.DELETE.Params,
      PBTypes.partner.api.v1.appointments.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.appointmentService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Appointment not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Appointment deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/appointments/check-availability:
   *   post:
   *     summary: Check availability for an appointment
   *     tags: [Appointments]
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
   *               - appointment_date
   *               - duration_minutes
   *             properties:
   *               team_member_id:
   *                 type: string
   *               appointment_date:
   *                 type: string
   *                 format: date
   *               duration_minutes:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Availability status
   */
  @Post("/check-availability")
  public async checkAvailability(
    req: Request<
      PBTypes.partner.api.v1.appointments.checkAvailability.POST.Params,
      PBTypes.partner.api.v1.appointments.checkAvailability.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.appointments.checkAvailability.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.appointments.checkAvailability.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CheckAvailabilityRequest = req.body;
      const available = await this.appointmentService.checkAvailability(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { available },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
