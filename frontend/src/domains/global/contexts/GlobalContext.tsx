import { createContext, useCallback, useMemo, useState } from "react";
import { userFilterDefaultValues } from "@/domains/users/constants";
import { Childrenable, UsersFilter } from "../types";
import { AUTH_CHANNEL } from "../constants";
import safeNavigate from "../utils/safeNavigate";

interface GlobalContextValues {
  usersFilter?: UsersFilter;
  handleUsersFilter: (value: Partial<UsersFilter>) => void;
  authChannel: BroadcastChannel;
}

const GlobalContext = createContext<GlobalContextValues | null>(null);
const authChannel = new BroadcastChannel("auth");

function GlobalProvider({ children }: Childrenable) {
  authChannel.onmessage = (event) => {
    if (event?.data?.type === AUTH_CHANNEL.SIGNIN) {
      safeNavigate("/profile");
    } else if (event?.data?.type === AUTH_CHANNEL.SIGNOUT) {
      safeNavigate("/");
    }
  };

  const [usersFilter, setUsersFilter] = useState<UsersFilter>({
    page: 1,
    ...userFilterDefaultValues,
  });

  const handleUsersFilter = useCallback((value: Partial<UsersFilter>) => {
    setUsersFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const valuesMemoized = useMemo(
    () => ({
      usersFilter,
      handleUsersFilter,
      authChannel,
    }),
    [usersFilter, handleUsersFilter]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
