import { Request, Response } from "@giusmento/mangojs-core";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
  Decorators,
} from "@giusmento/mangojs-core";
import { WorkingHoursService } from "../../../services/working-hours.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

type ShopWorkingHoursPost = PBTypes.partner.entities.ShopWorkingHoursPost;
type ShopWorkingHoursPut = PBTypes.partner.entities.ShopWorkingHoursPut;

// Resolve service from container
const workingHoursService = partnerContainer.get<WorkingHoursService>(
  WorkingHoursService,
  { autobind: true }
);

/**
 * @swagger
 * tags:
 *   name: WorkingHours
 *   description: Shop working hours management endpoints
 */
@Controller("/api/v1/shops/:shop_uid/working-hours")
export class WorkingHoursController {
  private workingHoursService: WorkingHoursService;

  constructor() {
    this.workingHoursService = workingHoursService;
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/working-hours:
   *   post:
   *     summary: Create a new working hours slot
   *     tags: [WorkingHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - day_of_week
   *               - start_time
   *               - end_time
   *             properties:
   *               day_of_week:
   *                 type: integer
   *                 minimum: 0
   *                 maximum: 6
   *                 description: Day of week (0=Sunday, 6=Saturday)
   *               start_time:
   *                 type: string
   *                 example: "08:00"
   *               end_time:
   *                 type: string
   *                 example: "13:00"
   *               slot_order:
   *                 type: integer
   *                 default: 0
   *     responses:
   *       201:
   *         description: Working hours created successfully
   *       400:
   *         description: Bad request
   */
  @Post("/")
  @Decorators.auth.NoAuth()
  public async create(
    req: Request<PBTypes.partner.api.v1.workingHours.POST.Params>, //params
    res: Response<PBTypes.partner.api.v1.workingHours.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.workingHours.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shop_uid } = req.params;
      req.query;
      const data = req.body;
      data;
      const workingHours = await this.workingHoursService.create({
        ...data,
        shop_uid,
      });

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: workingHours,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/working-hours/{uid}:
   *   get:
   *     summary: Get working hours by ID
   *     tags: [WorkingHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Working hours details
   *       404:
   *         description: Working hours not found
   */
  @Get("/:uid")
  @Decorators.auth.NoAuth()
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.workingHours.GET.ParamsSingle,
      PBTypes.partner.api.v1.workingHours.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBodySingle>
  ): Promise<
    Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBodySingle>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const workingHours = await this.workingHoursService.findById(uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: workingHours,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/working-hours:
   *   get:
   *     summary: Get all working hours for a shop
   *     tags: [WorkingHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of working hours
   */
  @Get("/")
  @Decorators.auth.NoAuth()
  public async findByShop(
    req: Request<
      PBTypes.partner.api.v1.workingHours.GET.Params,
      PBTypes.partner.api.v1.workingHours.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shop_uid } = req.params;
      const workingHours = await this.workingHoursService.findByShop(shop_uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: workingHours as any,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/working-hours/{uid}:
   *   put:
   *     summary: Update working hours
   *     tags: [WorkingHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               day_of_week:
   *                 type: integer
   *                 minimum: 0
   *                 maximum: 6
   *               start_time:
   *                 type: string
   *               end_time:
   *                 type: string
   *               slot_order:
   *                 type: integer
   *               is_active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Working hours updated successfully
   *       404:
   *         description: Working hours not found
   */
  @Put("/:uid")
  @Decorators.auth.NoAuth()
  public async update(
    req: Request<
      PBTypes.partner.api.v1.workingHours.PUT.Params,
      PBTypes.partner.api.v1.workingHours.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.workingHours.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: ShopWorkingHoursPut = req.body;
      const workingHours = await this.workingHoursService.update(uid, data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: workingHours as any,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/working-hours/{uid}:
   *   delete:
   *     summary: Delete working hours
   *     tags: [WorkingHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Working hours deleted successfully
   *       404:
   *         description: Working hours not found
   */
  @Delete("/:uid")
  @Decorators.auth.NoAuth()
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.workingHours.DELETE.Params,
      PBTypes.partner.api.v1.workingHours.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.DELETE.ResponseBody>
  ): Promise<
    Response<PBTypes.partner.api.v1.workingHours.DELETE.ResponseBody>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.workingHoursService.delete(uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { success },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
