export const isUserPremium = (user) => {
  if (!user?.premium) return false;

  const now = new Date();

  const activeSubscription =
    user.premium.isPremium === true;

  const activeTrial =
    user.premium.trialStartedAt &&
    user.premium.trialExpiresAt &&
    new Date(user.premium.trialExpiresAt) > now;

  return activeSubscription || activeTrial;
};