export const checkPremiumAccess = (user) => {
  const now = new Date();

  // Paid premium always allowed
  if (user.premiumType === "paid") return true;

  // Trial check
  if (user.premiumType === "trial") {
    return now <= new Date(user.trialEndsAt);
  }

  return false;
};