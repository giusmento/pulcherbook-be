import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Response,
  utils,
  errors,
  Decorators,
} from "@giusmento/mangojs-core";
import { SpecialHoursService } from "../../../services/special-hours.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

type ShopSpecialHoursPost = PBTypes.partner.entities.ShopSpecialHoursPost;
type ShopSpecialHoursPut = PBTypes.partner.entities.ShopSpecialHoursPut;

// Resolve service from container
const specialHoursService = partnerContainer.get<SpecialHoursService>(
  SpecialHoursService,
  { autobind: true }
);

/**
 * @swagger
 * tags:
 *   name: SpecialHours
 *   description: Shop special hours management endpoints
 */
@Controller("/api/v1/shops/:shop_uid/special-hours")
export class SpecialHoursController {

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/special-hours:
   *   post:
   *     summary: Create a new special hours slot
   *     tags: [SpecialHours]
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
   *               - special_date
   *             properties:
   *               special_date:
   *                 type: string
   *                 format: date
   *                 example: "2025-12-25"
   *               is_recurring_annual:
   *                 type: boolean
   *                 default: false
   *               start_time:
   *                 type: string
   *                 example: "10:00"
   *               end_time:
   *                 type: string
   *                 example: "14:00"
   *               slot_order:
   *                 type: integer
   *                 default: 0
   *               is_closed:
   *                 type: boolean
   *                 default: false
   *               description:
   *                 type: string
   *                 example: "Christmas Day"
   *     responses:
   *       201:
   *         description: Special hours created successfully
   *       400:
   *         description: Bad request
   */
  @Post("/")
  @Decorators.auth.NoAuth()
  public async create(
    req: Request<
      PBTypes.partner.api.v1.specialHours.POST.Params,
      PBTypes.partner.api.v1.specialHours.POST.RequestBody,
      PBTypes.partner.api.v1.specialHours.POST.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.specialHours.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.specialHours.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shop_uid } = req.params;
      const data: ShopSpecialHoursPost = req.body;
      const specialHours = await specialHoursService.create({
        ...data,
        special_date: new Date(data.special_date),
        shop_uid,
      });

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: specialHours,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/special-hours/{uid}:
   *   get:
   *     summary: Get special hours by ID
   *     tags: [SpecialHours]
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
   *         description: Special hours details
   *       404:
   *         description: Special hours not found
   */
  @Get("/:uid")
  @Decorators.auth.NoAuth()
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.specialHours.GET.ParamsSingle,
      PBTypes.partner.api.v1.specialHours.GET.RequestBody,
      PBTypes.partner.api.v1.specialHours.GET.QueryParamsSingle
    >,
    res: Response<PBTypes.partner.api.v1.specialHours.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.specialHours.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const specialHours = await specialHoursService.findById(uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: specialHours,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/special-hours:
   *   get:
   *     summary: Get all special hours for a shop
   *     tags: [SpecialHours]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: shop_uid
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         description: Optional - filter by specific date
   *     responses:
   *       200:
   *         description: List of special hours
   */
  @Get("/")
  @Decorators.auth.NoAuth()
  public async findByShop(
    req: Request<
      PBTypes.partner.api.v1.specialHours.GET.Params,
      PBTypes.partner.api.v1.specialHours.GET.RequestBody,
      PBTypes.partner.api.v1.specialHours.GET.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.specialHours.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.specialHours.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shop_uid } = req.params;
      const { date } = req.query;

      let specialHours;
      if (date) {
        specialHours = await specialHoursService.findByDate(
          shop_uid,
          new Date(date as string)
        );
      } else {
        specialHours = await specialHoursService.findByShop(shop_uid);
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: specialHours,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/special-hours/{uid}:
   *   put:
   *     summary: Update special hours
   *     tags: [SpecialHours]
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
   *               special_date:
   *                 type: string
   *                 format: date
   *               is_recurring_annual:
   *                 type: boolean
   *               start_time:
   *                 type: string
   *               end_time:
   *                 type: string
   *               slot_order:
   *                 type: integer
   *               is_closed:
   *                 type: boolean
   *               description:
   *                 type: string
   *               is_active:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Special hours updated successfully
   *       404:
   *         description: Special hours not found
   */
  @Put("/:uid")
  @Decorators.auth.NoAuth()
  public async update(
    req: Request<
      PBTypes.partner.api.v1.specialHours.PUT.Params,
      PBTypes.partner.api.v1.specialHours.PUT.RequestBody,
      PBTypes.partner.api.v1.specialHours.PUT.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.specialHours.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.specialHours.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: ShopSpecialHoursPut = req.body;
      const updateData = {
        ...data,
        special_date: data.special_date ? new Date(data.special_date) : undefined,
      };
      const specialHours = await specialHoursService.update(uid, updateData);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: specialHours,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/shops/{shop_uid}/special-hours/{uid}:
   *   delete:
   *     summary: Delete special hours
   *     tags: [SpecialHours]
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
   *         description: Special hours deleted successfully
   *       404:
   *         description: Special hours not found
   */
  @Delete("/:uid")
  @Decorators.auth.NoAuth()
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.specialHours.DELETE.Params,
      PBTypes.partner.api.v1.specialHours.DELETE.RequestBody,
      PBTypes.partner.api.v1.specialHours.DELETE.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.specialHours.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.specialHours.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await specialHoursService.delete(uid);

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
