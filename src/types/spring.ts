export interface SpringData {
  [key: string]: number;
}
export interface SpringProps {
  to: any | number | SpringData;
  from?: any | number | SpringData;
  stiffness: number;
  damping: number;
  mass: number;
  velocity: number;
  precision: number;
  framesPerSecond: number;
  isPendulum: boolean;
  updateDebounce: number;
}
