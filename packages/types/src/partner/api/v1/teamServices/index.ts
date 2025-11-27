import { TeamService } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Omit<TeamService, "updatedAt">;
