export interface SpringValue {
  [key: string]: number;
}
export interface SpringProps {
  to?: any | number | SpringValue;
  from?: any | number | SpringValue;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  precision?: number;
  framesPerSecond?: number;
  isPendulum?: boolean;
}
