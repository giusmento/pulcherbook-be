import {
  Request,
  Response,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  utils,
  errors,
  Decorators,
  Containers,
} from "@giusmento/mangojs-core";
import { WorkingHoursService } from "../../../services/working-hours.service";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
import { partnerContainer } from "../../../inversify.config";
import { UpsertWorkingHoursRequest } from "packages/types/dist/partner/requests/working-hours.requests";

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
@Controller("/api/partner/v1/partners/:partnerUid/shops/:shopUid/working-hours")
export class WorkingHoursController {
  /**
   * @swagger
   * /api/v1/partners/:partner_uid/shops/{shop_uid}/working-hours:
   *   get:
   *     summary: Get All working hours by Shop Uid
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
  @Get("/")
  @Decorators.auth.NoAuth()
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.workingHours.GET.Params,
      PBTypes.partner.api.v1.workingHours.GET.RequestBody,
      PBTypes.partner.api.v1.workingHours.GET.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.workingHours.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shopUid } = req.params;
      const workingHours = await workingHoursService.findByShop(shopUid);

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
   *   put:
   *     summary: Update All working hours
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
  @Put("/")
  @Decorators.auth.NoAuth()
  public async update(
    req: Request<
      PBTypes.partner.api.v1.workingHours.PUT.Params,
      PBTypes.partner.api.v1.workingHours.PUT.RequestBody,
      PBTypes.partner.api.v1.workingHours.PUT.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.workingHours.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { shopUid } = req.params;
      const data: UpsertWorkingHoursRequest = req.body;
      const workingHours = await workingHoursService.upsert(shopUid, data);

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
      PBTypes.partner.api.v1.workingHours.DELETE.RequestBody,
      PBTypes.partner.api.v1.workingHours.DELETE.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.workingHours.DELETE.ResponseBody>
  ): Promise<
    Response<PBTypes.partner.api.v1.workingHours.DELETE.ResponseBody>
  > {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await workingHoursService.delete(uid);

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
