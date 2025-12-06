import { useEffect, useState } from "react";
import { getUserId } from "../user";

// so anything needing client-only things will need components
// to handle an absent state. this is obvious i guess, and the good part
// is the second render with data can come after just a render cycle
// and not an async call, so it doesn't necessarily mean a wait. will
// there still be a flash though?
export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    setUserId(getUserId);
  }, []);

  return userId;
};
