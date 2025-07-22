import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
  } from "react";
  import * as signalR from "@microsoft/signalr";
//   import axios from "../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/Store";
import notificationService from "../Services/NotificationService";
import type { Notification } from "../Models/ResponseModels/NotificationResponseModel";
  
  interface NotificationContextType {
    notifications: Notification[];
    fetchNotifications: () => Promise<void>;
  }
  
  const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
  
  //  Props for Provider
  interface NotificationProviderProps {
    children: ReactNode;
  }
  
  export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const user = useSelector((state:RootState)=> state.auth.currentUser);
  
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
  
    const fetchNotifications = async () => {
      try {
        if (!user?.id) return;
  
        // const res = await axios.get(`/notification/unread/${user.id}`);
        const res = await notificationService.getUnreadNotifications(parseInt(user.id));
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
  
    useEffect(() => {
      const setupConnection = async () => {
        if (!user?.isNotificationOn || !user?.id) {
          // Disconnect if necessary
          if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
            console.log("🔌 SignalR disconnected");
          }
          return;
        }
  
        // Already connected
        if (connectionRef.current) return;
  
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5124/hubs/notifications", {
            accessTokenFactory: () => localStorage.getItem("access_token") || "",
          })
          .withAutomaticReconnect()
          .build();
  
        connection.on("ReceiveNotification", (message: any) => {
          console.log("Notification received:", message);
          fetchNotifications();
        });
  
        try {
          await connection.start();
          console.log(" SignalR connected");
          connectionRef.current = connection;
  
          fetchNotifications();
        } catch (err) {
          console.error(" SignalR connection error:", err);
        }
      };
  
      setupConnection();
  
      return () => {
        if (connectionRef.current) {
          connectionRef.current.stop();
          connectionRef.current = null;
        }
      };
    }, [user?.isNotificationOn, user?.id]);
  
    return (
      <NotificationContext.Provider value={{ notifications, fetchNotifications }}>
        {children}
      </NotificationContext.Provider>
    );
  };
  
  export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
  };
  