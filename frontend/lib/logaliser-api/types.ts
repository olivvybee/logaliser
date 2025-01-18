export interface Coaster {
  id: number;
  name: string;
  parkId: number;
  opened?: string;
  latitude?: number;
  longitude?: number;
  make?: string;
  model?: string;
  type?: string;
  design?: string;
  length?: number;
  height?: number;
  drop?: number;
  speed?: number;
  verticalAngle?: number;
  inversions?: number;
  duration?: number;
  park: {
    name: string;
  };
}
