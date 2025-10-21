// Shared types for PulcherBook IAM services
import { services } from "@giusmento/mangojs-core";
// Then re-export the specific namespace
const { v1 } = services.iam_server.types.api;

export { v1 };
