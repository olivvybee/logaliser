export enum StatusVisibility {
  Public = 0,
  Unlisted = 1,
  Followers = 2,
  Private = 3,
  Authenticated = 4,
  Trusted = 5,
}

export interface TraewellingUser {
  id: number;
  displayName: string;
  username: string;
  totalDistance: number;
  totalDuration: number;
  privateProfile: boolean;
  defaultStatusVisibility: StatusVisibility;
}
