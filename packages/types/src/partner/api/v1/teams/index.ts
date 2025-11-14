import { Team, TeamMember } from "../../../entities";

export * as POST from "./POST";
export * as GET from "./GET";
export * as PUT from "./PUT";
export * as DELETE from "./DELETE";

export type ResponseBodyData = Team & {
  members?: Array<Pick<TeamMember, "uid" | "user_id" | "role" | "joined_at">>;
};
