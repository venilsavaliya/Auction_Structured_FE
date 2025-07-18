
export interface IAuctionModalProps {
    open: boolean;
    onClose: () => void;
    isEdit?: boolean;
    auctionId?: number | null;
  }