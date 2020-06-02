import { SpringProps } from '../types';

export const springDefaults: SpringProps = {
  // init value
  from: 0,
  // desired value
  to: 0,
  // spring stiffness, in kg / s^2
  stiffness: 170,
  // damping constant, in kg / s
  damping: 26,
  // spring mass
  mass: 1,
  // initial velocity
  velocity: 0,
  // number of digits to round the values
  // increase the number to increase precision
  precision: 2,
  // display refresh rate
  framesPerSecond: 60,
  // is animation repeated
  isPendulum: false,
};
