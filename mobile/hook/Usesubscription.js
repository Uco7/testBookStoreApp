import { useContext } from "react";
import { SubscriptionContext } from "../context/subScriptionContext";

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error(
      "useSubscription must be used inside SubscriptionProvider"
    );
  }

  return context;
};