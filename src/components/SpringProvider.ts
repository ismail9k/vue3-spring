import spring from '../spring';

import { SpringProps } from '../types';

import { springSettings } from '../lib/settings';
import { watchEffect } from 'vue';

export default {
  name: 'SpringProvider',
  props: {
    from: {
      default: 0,
      type: Number,
    },
    to: {
      default: 0,
      required: true,
      type: Number,
    },
    // spring stiffness, in kg / s^2
    stiffness: {
      default: springSettings.stiffness,
      type: Number,
    },
    // damping constant, in kg / s
    damping: {
      default: springSettings.damping,
      type: Number,
    },
    // spring mass
    mass: {
      default: springSettings.mass,
      type: Number,
    },
    // initial velocity
    velocity: {
      default: springSettings.velocity,
      type: Number,
    },
    // number of digits to round the values
    precision: {
      default: springSettings.precision,
      type: Number,
    },
    // display refresh rate
    framesPerSecond: {
      default: springSettings.framesPerSecond,
      type: Number,
    },
    // is animation repeated
    isPendulum: {
      default: springSettings.isPendulum,
      type: Boolean,
    },
  },
  setup(props: SpringProps, { slots }: any) {
    const output = spring(props.from, props);
    watchEffect(() => (output.value = props.to));
    return () => slots?.default(output);
  },
};
