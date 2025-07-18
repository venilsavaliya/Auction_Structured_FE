export class RoutePaths {
  public static Root: string = "/";
  public static Login: string = "/Login";

  public static Admin: string = "/Admin";
  public static Dashboard: string = "dashboard";
  public static Auctions: string = "auctions";
  public static Users: string = "users";
  public static Teams: string = "teams";
  public static Players: string = "Players";

  public static AdminDashboard = this.Admin + "/" + this.Dashboard;
  public static AdminAuctions = this.Admin + "/" + this.Auctions;
  public static AdminUsers = this.Admin + "/" + this.Users;
  public static AdminTeams = this.Admin + "/" + this.Teams;
  public static AdminPlayers = this.Admin + "/" + this.Players;

  public static GetPaginatedAuctions = "/Auction/filter";
}

export class ApiRoutes {
  public static Auction: string = "/Auction";
  public static GetAuctionById = (id: number | string) =>
    `${this.Auction}/${id}`;

  public static User: string = "/User";
  public static GetPaginatedUsersList = this.User + "/filter";
  public static DeleteUserById = (id: number | string) => `${this.User}/${id}`;
  public static GetUserById = (id: number | string) => `${this.User}/${id}`;

  public static Team: string = "/Team";
  public static GetPaginatedTeamsList: string = this.Team + "/filter";
  public static DeleteTeamById = (id: number | string) => `${this.Team}/${id}`;
  public static GetTeamById = (id: number | string) => `${this.Team}/${id}`;

  public static Player: string = "/Player";
  public static GetPaginatedPlayersList: string = this.Player + "/filter";
  public static DeletePlayerById = (id: number | string) => `${this.Player}/${id}`;
  public static GetPlayerById = (id: number | string) => `${this.Player}/${id}`;
}

export class UserRoles {
  public static Admin: string = "Admin";
  public static User: string = "User";
  public static Manager: string = "Manager";
}
