import { reactive, watch, computed } from 'vue';

import { getFarestValue, requestAnimation, cancelAnimation } from '../utils';

import { SpringProps } from '../types';

export default {
  name: 'Spring',
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
  setup(props: SpringProps, { slots }: any) {
    const currentData: any = reactive({
      value: initCurrentValue(),
      desired: props.end,
      velocity: props.velocity,
    });
    const output: any = computed(() => roundNumber(currentData.value));

    // Non reactive values
    let animationId: number = 0;
    const roundingPrecision = Math.pow(10, props.precision);
    const dumpingPrecision = 1 / roundingPrecision;

    // Start the party
    watch(props, start, { immediate: true });

    function start() {
      // update desired value
      currentData.desired = initDesiredValue();
      animationId = requestAnimation(dumpValue);
    }

    function dumpValue() {
      const { stiffness, damping, mass } = props;

      // check if value is already dumped
      if (!isDumped()) {
        const springForce = -1 * stiffness * (currentData.value - currentData.desired);
        const damperForce = -1 * damping * currentData.velocity;
        const acceleration = (springForce + damperForce) / mass;

        currentData.velocity += acceleration / props.framesPerSecond;
        currentData.value += currentData.velocity / props.framesPerSecond;
        cancelAnimation(animationId);
        animationId = requestAnimation(dumpValue);
        return;
      }

      // If dumped start animation in reverse direction
      if (props.direction === 'pendulum') {
        switchValueDirection();
      }
    }

    function isDumped() {
      const velocity = Math.abs(currentData.velocity);
      const delta = Math.abs(currentData.value - currentData.desired);
      return velocity < dumpingPrecision && delta < dumpingPrecision;
    }

    function roundNumber(value: number) {
      return Math.round(value * roundingPrecision) / roundingPrecision;
    }

    function initDesiredValue(): number {
      return (props.direction === 'reverse' ? props.from : props.to) || 0;
    }

    function initCurrentValue(): number {
      return (props.direction === 'reverse' ? props.to : props.from) || 0;
    }

    function switchValueDirection(): void {
      const valuesArray = [props.from, props.to];
      currentData.desired = getFarestValue(valuesArray, currentData.value);
    }

    return () => slots?.default(output.value);
  },
};
