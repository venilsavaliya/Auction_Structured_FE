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
  public static MatchScoreDashboard: string = "match/scoredashboard/:id";

  public static AdminDashboard = this.Admin + "/" + this.Dashboard;
  public static AdminAuctions = this.Admin + "/" + this.Auctions;
  public static AdminUsers = this.Admin + "/" + this.Users;
  public static AdminTeams = this.Admin + "/" + this.Teams;
  public static AdminPlayers = this.Admin + "/" + this.Players;
  public static AdminMatches = this.Admin + "/" + this.Matches;
  public static AdminScoringRules = this.Admin + "/" + this.ScoringRules;

  public static AuctionLobby = this.Auctions + "/" + "lobby/:id";
  public static AuctionLive = this.Auctions + "/live/:id";
  public static ScoreCard = this.Auctions + "/scorecard/:id";

  public static GetPaginatedAuctions = "/Auction/filter";

  public static User: string = "/user";
  public static UserHome: string = "home";
  public static UserAuctions: string = "auctions";
  public static UserMyAuctions: string = "auctions/my";
  public static UserAuctionLive: string = "auctions/live/:auctionId";
  public static UserTeams: string = "teams/:auctionId";

  public static UserHomeFull = this.User + "/" + this.UserHome;
  public static UserAuctionsFull = this.User + "/" + this.UserAuctions;
  public static UserMyAuctionsFull = this.User + "/" + this.UserMyAuctions;
  public static UserAuctionLiveFull = this.User + "/" + this.UserAuctionLive;
  public static UserTeamsFull = this.User + "/" + this.UserTeams;

}

export class ApiRoutes {
  public static GetUnreadNotifications = (id:number)=> `/notification/unread/${id}`;
  public static AuctionParticipant: string = "/AuctionParticipant";
  public static GetAuctionParticipantDetail: string =
    this.AuctionParticipant + "/fetch";
  public static GetAuctionParticipantById = (id: number) =>
    `${this.AuctionParticipant}/teams/joined/${id}`;
  public static GetAuctionParticipantsById = (id: number) =>
    `${this.AuctionParticipant}/${id}`;

  public static Auction: string = "/Auction";
  public static GetAuctionById = (id: number | string) =>
    `${this.Auction}/${id}`;
  public static DeleteAuctionById = (id: number) => `${this.Auction}/${id}`;
  public static GetCurrentAuctionPlayer = (id: number) =>
    `${this.Auction}/currentPlayer/${id}`;
  public static MarkPlayerSold: string = `${this.Auction}/player/marksold`;
  public static SetCurrentAuctionPlayer = `${this.Auction}/setcurrentPlayer`;
  public static GetNextPlayer = (id: number) =>
    `${this.Auction}/next-player/${id}`;
  public static GetUserTeams = (id: number) => `${this.Auction}/teams/${id}`;

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

  public static Bid: string = "/bid";
  public static BidPlace: string = this.Bid + "/place";
  public static LatestBid: string = this.Bid + "/latest";

  public static UserTeam: string = "/UserTeam";
  public static GetAllTeamPlayers: string = `${this.UserTeam}/getlist`;

  public static AuctionPlayer: string = `/AuctionPlayer`;

  public static MarkAllNotificationAsReadOfUser = (id:number) => `/notification/MarkAllNotification/${id}`;
  public static ChangeNotificationStatus = "/user/changenotificationstatus";
}

export class UserRoles {
  public static Admin: string = "Admin";
  public static User: string = "User";
  public static Manager: string = "Manager";
  public static Guest: string = "Guest";
}
