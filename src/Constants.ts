export class RoutePaths {
  public static Root: string = "/";
  public static Login: string = "/Login";

  public static Admin: string = "/Admin";
  public static Dashboard: string = "dashboard";
  public static Auctions: string = "auctions";
  public static Users: string = "users";
  public static Teams: string = "teams";
  public static Players: string = "Players";
  public static Matches: string = "Matches";
  public static ScoringRules: string = "ScoringRules";

  public static AdminDashboard = this.Admin + "/" + this.Dashboard;
  public static AdminAuctions = this.Admin + "/" + this.Auctions;
  public static AdminUsers = this.Admin + "/" + this.Users;
  public static AdminTeams = this.Admin + "/" + this.Teams;
  public static AdminPlayers = this.Admin + "/" + this.Players;
  public static AdminMatches = this.Admin + "/" + this.Matches;
  public static AdminScoringRules = this.Admin + "/" + this.ScoringRules;

  public static GetPaginatedAuctions = "/Auction/filter";
}

export class ApiRoutes {
  public static Auction: string = "/Auction";
  public static GetAuctionById = (id: number | string) =>
    `${this.Auction}/${id}`;
  public static DeleteAuctionById = (id: number) => `${this.Auction}/${id}`;

  public static User: string = "/User";
  public static GetUserNameList: string = this.User + "/usernamelist";
  public static GetPaginatedUsersList = this.User + "/filter";
  public static DeleteUserById = (id: number | string) => `${this.User}/${id}`;
  public static GetUserById = (id: number | string) => `${this.User}/${id}`;

  public static Team: string = "/Team";
  public static AllTeams: string = this.Team + "/all";
  public static GetPaginatedTeamsList: string = this.Team + "/filter";
  public static DeleteTeamById = (id: number | string) => `${this.Team}/${id}`;
  public static GetTeamById = (id: number | string) => `${this.Team}/${id}`;

  public static Player: string = "/Player";
  public static ChangePlayerStatus: string = this.Player + "/status";
  public static GetPaginatedPlayersList: string = this.Player + "/filter";
  public static DeletePlayerById = (id: number | string) =>
    `${this.Player}/${id}`;
  public static GetPlayerById = (id: number | string) => `${this.Player}/${id}`;

  public static Match: string = "/Match";
  public static GetPaginatedMatchesList: string = this.Match + "/filter";
  public static DeleteMatchById = (id: number) => `${this.Match}/${id}`;
  public static GetMatchById = (id: number | string) => `${this.Match}/${id}`;

  public static ScoringRule: string = "/ScoringRule";
  public static AllScoringRule: string = this.ScoringRule + "/All";
}

export class UserRoles {
  public static Admin: string = "Admin";
  public static User: string = "User";
  public static Manager: string = "Manager";
  public static Guest: string = "Guest";
}
