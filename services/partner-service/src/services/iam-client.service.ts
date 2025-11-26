import { injectable } from "inversify";
import axios, { AxiosInstance, AxiosError } from "axios";
import { errors, clients } from "@giusmento/mangojs-core";
import * as PBTypes from "@giusmento/pulcherbook-types";

// Namespace alias for cleaner code
import IAMTypes = PBTypes.iam;

/**
 * IAM Client Service - Handles HTTP communication with IAM Service
 *
 * Provides methods to interact with IAM service endpoints for user management
 * Uses axios for HTTP requests with built-in retry logic and error handling
 */
@injectable()
export class IAMClientService {
  private client: clients.ClientAPI;
  private baseURL: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // ms

  constructor() {
    this.baseURL = process.env.IAM_SERVICE_URL || "http://localhost:3001";

    this.client = new clients.ClientAPI(this.baseURL);
  }

  /**
   *  Register Partner
   *
   * @param data - Partner registration data
   * @returns Promise resolving to user data
   * @throws {APIError} on network or not found errors
   */
  public async registerPartner(
    data: IAMTypes.api.v1.auth.partners.register.POST.RequestBody,
    cookies: Record<string, string>
  ): Promise<IAMTypes.api.v1.auth.partners.register.POST.ResponseBody> {
    try {
      const response =
        await this.client.post<IAMTypes.api.v1.auth.partners.register.POST.RequestBody>(
          `/api/iam/v1/auth/partners/register`,
          data,
          {
            headers: {
              Cookie: Object.entries(cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join("; "),
            },
          }
        );

      return response.data;
    } catch (error) {
      throw this.transformError(error, "Failed to get partner user from IAM");
    }
  }

  /**
   *  Get Partners User from IAM Service
   *
   * @param partnerUid - User UID to retrieve
   * @returns Promise resolving to user data
   * @throws {APIError} on network or not found errors
   */
  public async getPartnerUsers(
    partnerUid: string,
    cookies: Record<string, string>
  ): Promise<IAMTypes.api.v1.users.ResponseBodyData[]> {
    try {
      const response =
        await this.client.get<IAMTypes.api.v1.users.GET.ResponseBody>(
          `/api/iam/v1/partners/${partnerUid}/users/`,
          {
            headers: {
              Cookie: Object.entries(cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join("; "),
            },
          }
        );

      return response.data;
    } catch (error) {
      throw this.transformError(error, "Failed to get partner user from IAM");
    }
  }

  /**
   *  Get Partner User from IAM Service
   *
   * @param partnerUid - User UID to retrieve
   * @param uid - User UID to retrieve
   * @param cookies - Cookies for authentication
   * @returns Promise resolving to user data
   * @throws {APIError} on network or not found errors
   */
  public async getPartnerUserByUid(
    partnerUid: string,
    uid: string,
    cookies: Record<string, string>
  ): Promise<IAMTypes.api.v1.users.ResponseBodyData> {
    try {
      const response =
        await this.client.get<IAMTypes.api.v1.users.GET.ResponseBodySingle>(
          `/api/iam/v1/partners/${partnerUid}/users/${uid}`,
          {
            headers: {
              Cookie: Object.entries(cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join("; "),
            },
          }
        );

      return response.data;
    } catch (error) {
      throw this.transformError(error, "Failed to get partner user from IAM");
    }
  }

  /**
   * Create Partner User in IAM Service
   *
   * @param data - Partner user creation data
   * @returns Promise resolving to created user with uid
   * @throws {APIError} on validation or network errors
   */
  public async createPartnerUser(
    partnerUid: string,
    data: IAMTypes.api.v1.users.POST.RequestBody,
    cookies: Record<string, string>
  ): Promise<{ uid: string; email: string }> {
    try {
      const payload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        groups: [],
      };

      const response = await this.client.post<
        IAMTypes.api.v1.users.POST.RequestBody,
        IAMTypes.api.v1.users.POST.ResponseBody
      >(`/api/iam/v1/partners/${partnerUid}/users/`, payload);

      return {
        uid: response.data.uid,
        email: response.data.email,
      };
    } catch (error) {
      throw this.transformError(error, "Failed to create partner user in IAM");
    }
  }

  /**
   * Delete Partner User from IAM Service
   *
   * @param uid - User UID to delete
   * @returns Promise resolving to true if successful
   * @throws {APIError} on network or not found errors
   */
  public async deletePartnerUser(
    partnerUid: string,
    uid: string,
    cookies: Record<string, string>
  ): Promise<boolean> {
    try {
      await this.retryRequest(async () => {
        return await this.client.delete(`/api/v1/users/${uid}`);
      });
      return true;
    } catch (error) {
      throw this.transformError(
        error,
        "Failed to delete partner user from IAM"
      );
    }
  }

  /**
   * Update Partner User in IAM Service
   *
   * @param uid - User UID to update
   * @param data - Update data
   * @returns Promise resolving to updated user
   * @throws {APIError} on validation or network errors
   */
  public async updatePartnerUser(
    partnerUid: string,
    uid: string,
    data: IAMTypes.api.v1.users.PUT.RequestBody,
    cookies: Record<string, string>
  ): Promise<{ uid: string; email: string }> {
    try {
      const response = await this.client.put(
        `/api/iam/v1/partners/${partnerUid}/users/${uid}`,
        data,
        {
          headers: {
            Cookie: Object.entries(cookies)
              .map(([key, value]) => `${key}=${value}`)
              .join("; "),
          },
        }
      );

      return {
        uid: response.data.uid,
        email: response.data.email,
      };
    } catch (error) {
      throw this.transformError(error, "Failed to update partner user in IAM");
    }
  }

  /**
   * Retry logic for failed requests
   * Implements exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }

      // Don't retry client errors (4xx), only server errors (5xx) and network errors
      if (axios.isAxiosError(error) && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      // Exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      console.log(
        `[IAM Client] Retry attempt ${attempt}/${this.maxRetries} after ${delay}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  /**
   * Transform errors to MangoJS APIError format
   */
  private transformError(error: any, defaultMessage: string): errors.APIError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          defaultMessage;

        return new errors.APIError(status, this.getErrorCode(status), message);
      } else if (error.request) {
        return new errors.APIError(
          503,
          "SERVICE_UNAVAILABLE",
          "IAM service is unavailable"
        );
      }
    }

    return new errors.APIError(500, "INTERNAL_ERROR", defaultMessage);
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
      500: "INTERNAL_ERROR",
      503: "SERVICE_UNAVAILABLE",
    };
    return codes[status] || "UNKNOWN_ERROR";
  }
}
