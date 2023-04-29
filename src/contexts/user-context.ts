import {createContext} from "../utils/context";

export type UserContext = {
  user?: BaseUser;
  setUser: (user: BaseUser) => void;
  removeUser: () => void;
};

export const [UserProvider, useUserContext] = createContext<UserContext>("user");
