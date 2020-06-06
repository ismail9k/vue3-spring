import spring from './spring';

import { isNumber } from '../lib/utils';
import { watchEffect, reactive } from 'vue';

import { SpringProps } from '../types';

export default {
  name: 'SpringProvider',
  props: {
    from: {
      default: () => ({}),
      type: [Object, Number],
    },
    to: {
      default: () => ({}),
      required: true,
      type: [Object, Number],
    },
    // spring stiffness, in kg / s^2
    stiffness: Number,
    // damping constant, in kg / s
    damping: Number,
    // spring mass
    mass: Number,
    // initial velocity
    velocity: Number,
    // number of digits to round the values
    precision: Number,
    // display refresh rate
    framesPerSecond: Number,
    // is animation repeated
    isPendulum: Boolean,
  },
  setup(props: SpringProps, { slots }: any) {
    const output = spring(props.to, props);

    // if there is only one value
    if (isNumber(props.to)) {
      watchEffect(() => (output.value = props.to));
      return () => slots?.default(output);
    }

    // if the sprint has more than one variable
    const values = Object.keys(props.to);
    watchEffect(() => {
      values.forEach((key) => (output[key] = props.to[key]));
    });
    return () => slots?.default(output);
  },
};
