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
import { CompanyMediaService } from "../../../services/company-media.service";

// Import API types from package
import type * as PBTypes from "@giusmento/pulcherbook-types";
type CompanyMediaPost = PBTypes.partner.entities.CompanyMediaPost;
type CompanyMediaPut = PBTypes.partner.entities.CompanyMediaPut;
import { partnerContainer } from "../../../inversify.config";

// Resolve service from container
const companyMediaService = partnerContainer.get<CompanyMediaService>(
  CompanyMediaService,
  {
    autobind: true,
  }
);

/**
 * @swagger
 * tags:
 *   name: CompanyMedia
 *   description: Company media management endpoints
 */
@Controller("/api/v1/company-media")
export class CompanyMediaController {
  private companyMediaService: CompanyMediaService;

  constructor() {
    this.companyMediaService = companyMediaService;
  }

  /**
   * @swagger
   * /api/v1/company-media:
   *   post:
   *     summary: Upload company media
   *     tags: [CompanyMedia]
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
   *               - url
   *               - type
   *             properties:
   *               partner_id:
   *                 type: string
   *               url:
   *                 type: string
   *               type:
   *                 type: string
   *                 enum: [LOGO, PHOTO, VIDEO]
   *               display_order:
   *                 type: integer
   *               alt_text:
   *                 type: string
   *     responses:
   *       201:
   *         description: Media uploaded successfully
   *       400:
   *         description: Invalid request data
   */
  @Post("/")
  public async create(
    req: Request<
      PBTypes.partner.api.v1.companyMedia.POST.Params,
      PBTypes.partner.api.v1.companyMedia.POST.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.companyMedia.POST.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.companyMedia.POST.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const data: CompanyMediaPost = req.body;
      const media = await this.companyMediaService.create(data);

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: media,
      };
      return res.status(201).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/company-media/{uid}:
   *   get:
   *     summary: Get company media by ID
   *     tags: [CompanyMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Media ID
   *     responses:
   *       200:
   *         description: Media details
   *       404:
   *         description: Media not found
   */
  @Get("/:uid")
  public async findById(
    req: Request<
      PBTypes.partner.api.v1.companyMedia.GET.ParamsSingle,
      PBTypes.partner.api.v1.companyMedia.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.companyMedia.GET.ResponseBodySingle>
  ): Promise<Response<PBTypes.partner.api.v1.companyMedia.GET.ResponseBodySingle>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const media = await this.companyMediaService.findById(uid);

      if (!media) {
        throw new errors.APIError(404, "NOT_FOUND", "Media not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: media,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/company-media:
   *   get:
   *     summary: Get all company media
   *     tags: [CompanyMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: partner_id
   *         schema:
   *           type: string
   *         description: Filter by partner ID
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [LOGO, PHOTO, VIDEO]
   *         description: Filter by media type
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
   *         description: List of media
   */
  @Get("/")
  public async findAll(
    req: Request<
      PBTypes.partner.api.v1.companyMedia.GET.Params,
      PBTypes.partner.api.v1.companyMedia.GET.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.companyMedia.GET.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.companyMedia.GET.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const partner_id = req.query.partner_id as string | undefined;
      const type = req.query.type as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const media = await this.companyMediaService.findAll(
        partner_id,
        type,
        limit,
        offset
      );

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: media,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/company-media/{uid}:
   *   put:
   *     summary: Update company media
   *     tags: [CompanyMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Media ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               display_order:
   *                 type: integer
   *               alt_text:
   *                 type: string
   *     responses:
   *       200:
   *         description: Media updated successfully
   *       404:
   *         description: Media not found
   */
  @Put("/:uid")
  public async update(
    req: Request<
      PBTypes.partner.api.v1.companyMedia.PUT.Params,
      PBTypes.partner.api.v1.companyMedia.PUT.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.companyMedia.PUT.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.companyMedia.PUT.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const data: CompanyMediaPut = req.body;
      const media = await this.companyMediaService.update(uid, data);

      if (!media) {
        throw new errors.APIError(404, "NOT_FOUND", "Media not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: media,
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }

  /**
   * @swagger
   * /api/v1/company-media/{uid}:
   *   delete:
   *     summary: Delete company media
   *     tags: [CompanyMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: Media ID
   *     responses:
   *       200:
   *         description: Media deleted successfully
   *       404:
   *         description: Media not found
   */
  @Delete("/:uid")
  public async delete(
    req: Request<
      PBTypes.partner.api.v1.companyMedia.DELETE.Params,
      PBTypes.partner.api.v1.companyMedia.DELETE.RequestBody
    >,
    res: Response<PBTypes.partner.api.v1.companyMedia.DELETE.ResponseBody>
  ): Promise<Response<PBTypes.partner.api.v1.companyMedia.DELETE.ResponseBody>> {
    const logRequest = new utils.LogRequest(res);
    try {
      const { uid } = req.params;
      const success = await this.companyMediaService.delete(uid);

      if (!success) {
        throw new errors.APIError(404, "NOT_FOUND", "Media not found");
      }

      const apiResponse = {
        ok: true,
        timestamp: logRequest.timestamp,
        requestId: logRequest.requestId,
        data: { message: "Media deleted successfully" },
      };
      return res.status(200).send(apiResponse);
    } catch (error: unknown) {
      return errors.errorHandler(res, error as Error);
    }
  }
}
