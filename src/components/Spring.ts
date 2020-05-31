import { reactive, watch } from 'vue';

import { SpringProps } from '../types';

export default {
  name: 'Spring',
  props: {
    from: {
      default() {
        return {};
      },
      type: Object,
    },
    to: {
      default() {
        return {};
      },
      required: true,
      type: Object,
    },
    // spring stiffness, in kg / s^2
    stiffness: {
      default: 170,
      type: Number,
    },
    // damping constant, in kg / s
    damping: {
      default: 26,
      type: Number,
    },
    // spring mass
    mass: {
      default: 1,
      type: Number,
    },
    // initial velocity
    velocity: {
      default: 0,
      type: Number,
    },
    // number of digits to round the values
    // increase the number to increase precision
    precision: {
      default: 2,
      type: Number,
    },
    // animation direction, forward, reverse, or alternate
    direction: {
      default: 'forward',
      type: String,
    },
  },
  setup(props: SpringProps, { slots }: any) {
    const frameRate = 1 / 60; // how many frame per ms
    const currentFrameValues: any = reactive({});
    const currentFrameVelocities: any = reactive({});
    const output: any = reactive({});

    // Non reactive values
    const roundingPrecision = Math.pow(10, props.precision);
    const dumpingPrecision = 1 / roundingPrecision;

    // Set initial values
    const { to, from, velocity } = props;
    Object.keys(to).forEach((key) => {
      currentFrameValues[key] = from[key] || 0;
      output[key] = roundNumber(currentFrameValues[key]);
      currentFrameVelocities[key] = velocity;
    });

    // Start the party
    watch(props, start, { immediate: true });

    function start() {
      Object.keys(props.to).forEach((key) => {
        window.requestAnimationFrame(() => dumpValue(key));
      });
    }

    function dumpValue(key: string) {
      const { to, stiffness, damping, mass } = props;

      // check if value is already dumped
      if (isDumped(key)) {
        return;
      }

      const springForce = -1 * stiffness * (currentFrameValues[key] - to[key]);
      const damperForce = -1 * damping * currentFrameVelocities[key];
      const acceleration = (springForce + damperForce) / mass;

      currentFrameVelocities[key] += acceleration * frameRate;
      currentFrameValues[key] += currentFrameVelocities[key] * frameRate;
      output[key] = roundNumber(currentFrameValues[key]);

      window.requestAnimationFrame(() => dumpValue(key));
    }

    function isDumped(key: string) {
      const velocity = Math.abs(currentFrameVelocities[key]);
      const delta = Math.abs(currentFrameValues[key] - props.to[key]);
      return velocity < dumpingPrecision && delta < dumpingPrecision;
    }

    function roundNumber(value: number) {
      return Math.round(value * roundingPrecision) / roundingPrecision;
    }

    return () => slots?.default(output);
  },
};
