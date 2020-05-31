export interface SpringData {
  [key: string]: any;
}

export interface SpringProps {
  to: SpringData;
  from: SpringData;
  precisionDigits: number;
  [key: string]: any;
}
