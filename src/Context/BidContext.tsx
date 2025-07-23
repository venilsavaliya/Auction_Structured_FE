import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
  } from "react";
  import * as signalR from "@microsoft/signalr";
  import { useSelector } from "react-redux";
  import type { RootState } from "../Redux/Store";
  // import bidService from "../Services/BidService/BidService"; // If you want to fetch initial bids
  import type { Bid } from "../Models/ResponseModels/BidResponseModel";
  
  interface BidContextType {
    latestBid: Bid | null;
    // Optionally, you can add a function to fetch all bids or clear the latest bid
    // fetchBids: () => Promise<void>;
  }
  
  const BidContext = createContext<BidContextType | undefined>(undefined);
  
  interface BidProviderProps {
    children: ReactNode;
  }
  
  export const BidProvider: React.FC<BidProviderProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.currentUser);
  
    const [latestBid, setLatestBid] = useState<Bid | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
  
    useEffect(() => {
      const setupConnection = async () => {
        if (!user?.id) {
          // Disconnect if necessary
          if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
            console.log("🔌 Bid SignalR disconnected");
          }
          return;
        }
  
        // Already connected
        if (connectionRef.current) return;
  
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5124/hubs/bids", {
            accessTokenFactory: () => localStorage.getItem("access_token") || "",
          })
          .withAutomaticReconnect()
          .build();
  
        connection.on("ReceiveBid", (bid: Bid) => {
          console.log("Bid received:", bid);
          setLatestBid(bid);
          // Optionally, you can fetch all bids here if you want to update a list
        });
  
        try {
          await connection.start();
          console.log("Bid SignalR connected");
          connectionRef.current = connection;
        } catch (err) {
          console.error("Bid SignalR connection error:", err);
        }
      };
  
      setupConnection();
  
      return () => {
        if (connectionRef.current) {
          connectionRef.current.stop();
          connectionRef.current = null;
        }
      };
    }, [user?.id]);
  
    return (
      <BidContext.Provider value={{ latestBid }}>
        {children}
      </BidContext.Provider>
    );
  };
  
  export const useBid = (): BidContextType => {
    const context = useContext(BidContext);
    if (!context) {
      throw new Error("useBid must be used within a BidProvider");
    }
    return context;
  };