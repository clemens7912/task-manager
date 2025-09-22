import { User } from "../models/user";

export const getDifferentUsers = (apiList: User[], localList: User[]): User[] => {
    return apiList.filter(apiUser => !localList.some(localUser => localUser.id === apiUser.id));
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const checkScreenSize = (): boolean => {
  return window.innerWidth < 768;
}
