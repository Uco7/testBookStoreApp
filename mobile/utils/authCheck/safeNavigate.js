import { getAuthStatus } from "./authStatus";

export const safeNavigate = async (router, route, fallback = "/login") => {
  const status = await getAuthStatus();

  if (status === "authenticated") {
    router.push(route);
  } else {
    router.push(fallback);
  }
};