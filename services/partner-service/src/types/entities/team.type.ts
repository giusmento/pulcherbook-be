import * as models from "../../db/models";

export type Team = models.Team;
export type TeamPost = Pick<Team, "partner_id" | "name" | "description">;
export type TeamPut = Partial<Omit<TeamPost, "partner_id">>;
