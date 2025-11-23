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
  Containers,
  Decorators,
} from "@giusmento/mangojs-core";
import { ShopService } from "../../../services/shop.service";
import { PartnerService } from "../../../services/partner.service";
import { partnerContainer } from "../../../inversify.config";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";

type ShopPost = PBTypes.partner.entities.ShopPost;
type ShopPut = PBTypes.partner.entities.ShopPut;

// Resolve service from container
const shopService = partnerContainer.get<ShopService>(ShopService, {
  autobind: true,
});
const partnerService = partnerContainer.get<PartnerService>(PartnerService, {
  autobind: true,
});

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Shop management endpoints
 */
@Controller("/api/v1/partners/:partner_uid/shops")
export class ShopController {
  private shopService: ShopService;
  private partnerService: PartnerService;

  constructor() {
    this.shopService = shopService;
    this.partnerService = partnerService;
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops:
   *   post:
   *     summary: Create a new shop
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *               - shop_name
   *             properties:
   *               shop_name:
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
   *               instagram:
   *                 type: string
   *     responses:
   *       201:
   *         description: Shop created successfully
   *       400:
   *         description: Bad request
   */
  @Post("/")
  @Decorators.auth.NoAuth()
  public async create(
    req: Request<
      PBTypes.partner.api.v1.shops.POST.Params,
      PBTypes.partner.api.v1.shops.POST.RequestBody,
      PBTypes.partner.api.v1.shops.POST.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: ShopPost = req.body;
      const partner_uid = req.params.partner_uid;
      // get partner id from external_uid
      const partner = await this.partnerService.findByExternalUid(partner_uid);
      if (!partner) {
        throw new errors.APIError(400, "BAD_REQUEST", "Invalid partner UID");
      }
      const shop = await this.shopService.create({
        ...data,
        partner_uid: partner.uid,
      });

      const shopData: PBTypes.partner.api.v1.shops.ResponseBodyData = shop;

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shopData,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops/{uid}:
   *   get:
   *     summary: Get shop by ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *         description: Shop details
   *       404:
   *         description: Shop not found
   */
  @Get("/:uid")
  @Decorators.auth.NoAuth()
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.shops.GET.ParamsSingle,
      PBTypes.partner.api.v1.shops.GET.RequestBody,
      PBTypes.partner.api.v1.shops.GET.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.shops.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const shop = await this.shopService.findById(uid);

      if (!shop) {
        throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shop,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops:
   *   get:
   *     summary: Get all shops
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *     responses:
   *       200:
   *         description: List of shops
   */
  @Get("/")
  @Decorators.auth.NoAuth()
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.shops.GET.Params,
      PBTypes.partner.api.v1.shops.GET.RequestBody,
      PBTypes.partner.api.v1.shops.GET.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { partner_uid } = req.params as any;
      const { limit = 20, offset = 0 } = req.query as any;
      const shops = await this.shopService.findAllByPartner(
        partner_uid,
        Number(limit),
        Number(offset)
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shops,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops/{uid}:
   *   put:
   *     summary: Update shop
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *               shop_name:
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
   *               instagram:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Shop updated successfully
   *       404:
   *         description: Shop not found
   */
  @Put("/:uid")
  @Decorators.auth.NoAuth()
  public async update(
    req: Request<
      PBTypes.partner.api.v1.shops.PUT.Params,
      PBTypes.partner.api.v1.shops.PUT.RequestBody,
      PBTypes.partner.api.v1.shops.PUT.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: ShopPut = req.body;
      const shop = await this.shopService.update(uid, data);

      if (!shop) {
        throw new errors.APIError(404, "NOT_FOUND", "Shop not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shop,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops/{uid}:
   *   delete:
   *     summary: Delete shop
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *         description: Shop deleted successfully
   *       404:
   *         description: Shop not found
   */
  @Delete("/:uid")
  @Decorators.auth.NoAuth()
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.shops.DELETE.Params,
      PBTypes.partner.api.v1.shops.DELETE.RequestBody,
      PBTypes.partner.api.v1.shops.DELETE.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.shopService.delete(uid);

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

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops/{uid}/enable:
   *   post:
   *     summary: Enable shop (set status to ONLINE)
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *         description: Shop enabled successfully
   *       404:
   *         description: Shop not found
   */
  @Post("/:uid/enable")
  @Decorators.auth.NoAuth()
  public async enable(
    req: Request<
      PBTypes.partner.api.v1.shops.enable.POST.RequestParams,
      PBTypes.partner.api.v1.shops.enable.POST.RequestBody,
      PBTypes.partner.api.v1.shops.enable.POST.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.enable.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.enable.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const shop = await this.shopService.enable(uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shop,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/partners/{partner_uid}/shops/{uid}/disable:
   *   post:
   *     summary: Disable shop (set status to OFFLINE)
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: partner_uid
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
   *         description: Shop disabled successfully
   *       404:
   *         description: Shop not found
   */
  @Post("/:uid/disable")
  @Decorators.auth.NoAuth()
  public async disable(
    req: Request<
      PBTypes.partner.api.v1.shops.disable.POST.RequestParams,
      PBTypes.partner.api.v1.shops.disable.POST.RequestBody,
      PBTypes.partner.api.v1.shops.disable.POST.QueryParams
    >,
    res: Response<PBTypes.partner.api.v1.shops.disable.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.shops.disable.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const shop = await this.shopService.disable(uid);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: shop,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
