import { reactive, watch } from 'vue';

import { getFarestValue, requestAnimation, cancelAnimation } from '../utils';

import { SpringsProps } from '../types';

export default {
  name: 'Springs',
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
    // display refresh rate
    framesPerSecond: {
      default: 60,
      type: Number,
    },
    // animation direction, forward, reverse, or pendulum
    direction: {
      default: 'forward',
      type: String,
    },
  },
  setup(props: SpringsProps, { slots }: any) {
    const currentValues: any = reactive({});
    const currentVelocities: any = reactive({});
    const desiredValues: any = reactive({});
    const animations: any = reactive({});
    const output: any = reactive({});

    // Non reactive values
    const roundingPrecision = Math.pow(10, props.precision);
    const dumpingPrecision = 1 / roundingPrecision;

    // Set initial values
    Object.keys(props.to).forEach((key) => {
      currentValues[key] = getCurrentValue(key, props.direction);
      desiredValues[key] = getDesiredValue(key, props.direction);
      currentVelocities[key] = props.velocity;
      output[key] = roundNumber(currentValues[key]);
    });

    // Start the party
    watch(props, start, { immediate: true });

    function start() {
      // update desired value
      Object.keys(props.to).forEach((key) => {
        desiredValues[key] = getDesiredValue(key, props.direction);
      });

      Object.keys(props.to).forEach((key) => {
        animations[key] = requestAnimation(() => dumpValue(key));
      });
    }

    function dumpValue(key: string) {
      const { stiffness, damping, mass } = props;

      // check if value is already dumped
      if (isDumped(key)) {
        if (props.direction === 'pendulum') {
          switchValueDirection(key);
        } else {
          return;
        }
      }

      const springForce = -1 * stiffness * (currentValues[key] - desiredValues[key]);
      const damperForce = -1 * damping * currentVelocities[key];
      const acceleration = (springForce + damperForce) / mass;

      currentVelocities[key] += acceleration / props.framesPerSecond;
      currentValues[key] += currentVelocities[key] / props.framesPerSecond;
      output[key] = roundNumber(currentValues[key]);
      cancelAnimation(animations[key]);
      animations[key] = requestAnimation(() => dumpValue(key));
    }

    function isDumped(key: string) {
      const velocity = Math.abs(currentVelocities[key]);
      const delta = Math.abs(currentValues[key] - desiredValues[key]);
      return velocity < dumpingPrecision && delta < dumpingPrecision;
    }

    function roundNumber(value: number) {
      return Math.round(value * roundingPrecision) / roundingPrecision;
    }

    function getDesiredValue(key: string, direction: string): number {
      return (direction === 'reverse' ? props.from[key] : props.to[key]) || 0;
    }

    function getCurrentValue(key: string, direction: string): number {
      return (direction === 'reverse' ? props.to[key] : props.from[key]) || 0;
    }

    function switchValueDirection(key: string): void {
      const valuesArray = [props.from[key], props.to[key]];
      desiredValues[key] = getFarestValue(valuesArray, currentValues[key]);
    }

    return () => slots?.default(output);
  },
};
