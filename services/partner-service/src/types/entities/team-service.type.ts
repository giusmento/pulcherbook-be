import * as models from "../../db/models";

export type TeamService = models.TeamService;
export type TeamServicePost = Pick<TeamService, "team_id" | "service_id">;
export type TeamServicePut = Partial<TeamServicePost>;
