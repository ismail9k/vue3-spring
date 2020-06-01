import spring from '../spring';

import { SpringsProps } from '../types';

import { springSettings } from '../lib/settings';
import { watchEffect, reactive } from 'vue';

export default {
  name: 'SpringsProvider',
  props: {
    from: {
      default: () => ({}),
      type: Object,
    },
    to: {
      default: () => ({}),
      required: true,
      type: Object,
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
  setup(props: SpringsProps, { slots }: any) {
    const values = Object.keys(props.to);
    const springs = values.reduce((obj: any, key) => {
      obj[key] = spring(props.from[key] || 0, props);
      return obj;
    }, {});
    const output = reactive(springs);
    watchEffect(() => {
      values.forEach((key) => (output[key] = props.to[key]));
    });
    return () => slots?.default(output);
  },
};
