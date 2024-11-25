import { updateSession } from "@/lib/auth/updateSession";

const TEN_MINUTES = 600000;

setInterval(async () => {
  const success = await updateSession();

  if (!success) {
    console.error("Failed to update session");
  }
}, TEN_MINUTES);
