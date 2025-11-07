import * as models from "../../db/models";

export type TeamMember = models.TeamMember;
export type TeamMemberPost = Pick<TeamMember, "team_id" | "user_id" | "role">;
export type TeamMemberPut = Partial<Omit<TeamMemberPost, "team_id" | "user_id">>;
