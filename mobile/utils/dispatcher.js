import { scheduleTimetableNotifications } from "./regular";
import { schedulePremiumAlarms } from "./premium";

export async function scheduleStudyReminder(user, timetable) {
  if (user.isPremium) {
    return schedulePremiumAlarms(timetable);
  }

  return scheduleTimetableNotifications(timetable);
}