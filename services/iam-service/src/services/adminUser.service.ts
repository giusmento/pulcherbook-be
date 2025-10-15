import { injectable } from "inversify";
import { INVERSITY_TYPES, IPersistenceContext, Containers } from "@mangojs/core";

/**
 * Custom AdminUserService that resolves PersistenceContext at runtime
 * This ensures we always get the correct PostgresPersistenceContext
 * instead of the DummyPersistenceContext from the library
 */
@injectable()
export class AdminUserService {

  /**
   * Get PersistenceContext directly from container at runtime
   * instead of relying on constructor injection which might be cached
   */
  private get _persistenceContext(): IPersistenceContext {
    const container = Containers.getContainer();
    const context = container.get<IPersistenceContext>(INVERSITY_TYPES.PersistenceContext);

    console.log("[AdminUserService] Resolving PersistenceContext:", context.constructor.name);

    return context;
  }

  constructor() {
    console.log("[AdminUserService] Custom AdminUserService instantiated");
  }

  /**
   * Delegate all methods to the base service implementation
   * but use our runtime-resolved _persistenceContext
   */
  async AdminUserLogIn(email: string, password: string) {
    // Import the base service class dynamically to access its methods
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;

    // Create a temporary instance and call the method
    // This is a workaround - ideally we'd extend but private members prevent it
    const baseInstance = new BaseService();

    // Monkey-patch the _persistenceContext
    (baseInstance as any)._persistenceContext = this._persistenceContext;

    return baseInstance.AdminUserLogIn(email, password);
  }

  // Add other methods as needed following the same pattern
  async getAdminUsers() {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.getAdminUsers();
  }

  async getAdminUserByMagicLink(params: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.getAdminUserByMagicLink(params);
  }

  async activateAdminUser(params: any, body: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.activateAdminUser(params, body);
  }

  async postAdminUser(body: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.postAdminUser(body);
  }

  async updateAdminUser(params: any, body: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.updateAdminUser(params, body);
  }

  async updateGroupsToAdminUser(params: any, body: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.updateGroupsToAdminUser(params, body);
  }

  async disableAdminUser(params: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.disableAdminUser(params);
  }

  async enableAdminUser(params: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.enableAdminUser(params);
  }

  async hardDeleteAdminUser(params: any) {
    const { services } = await import("@mangojs/core");
    const BaseService = services.iam_server.services.AdminUserService;
    const baseInstance = new BaseService();
    (baseInstance as any)._persistenceContext = this._persistenceContext;
    return baseInstance.hardDeleteAdminUser(params);
  }
}
