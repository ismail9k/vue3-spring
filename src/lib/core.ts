import { reactive, computed } from 'vue';

import { getFarestValue, requestAnimation, cancelAnimation, debounce } from './utils';

import { springDefaults } from './defaults';

export default function springCore(settings: any) {
  const props = { ...springDefaults, ...settings };

  const state: any = reactive({
    currentValue: props.from,
    desiredValue: props.to,
    velocity: props.velocity,
  });

  // Non reactive values
  let animationId: number = 0;
  // Use for pendulum spring
  let lastDesiredValue: number = props.to;
  const roundingPrecision = Math.pow(10, props.precision);
  const dumpingPrecision = 1 / roundingPrecision;

  const output: any = computed({
    get: () => roundNumber(state.currentValue),
    set: (val) => {
      if (typeof val !== 'number') return;
      debounce(() => {
        state.desiredValue = lastDesiredValue = val;
        animationId = requestAnimation(dumpValue);
      }, props.updateDebounce)();
    },
  });

  // start action
  if (state.currentValue !== state.desiredValue) {
    animationId = requestAnimation(dumpValue);
  }

  function dumpValue() {
    const { stiffness, damping, mass } = props;

    // check if value is already dumped
    if (isDumped()) {
      // If dumped start animation in reverse direction
      if (props.isPendulum) {
        switchValueDirection();
      } else {
        return;
      }
    }

    const springForce = -1 * stiffness * (state.currentValue - state.desiredValue);
    const damperForce = -1 * damping * state.velocity;
    const acceleration = (springForce + damperForce) / mass;

    state.velocity += acceleration / props.framesPerSecond;
    state.currentValue += state.velocity / props.framesPerSecond;
    cancelAnimation(animationId);
    animationId = requestAnimation(dumpValue);
  }

  function isDumped() {
    const velocity = Math.abs(state.velocity);
    const delta = Math.abs(state.currentValue - state.desiredValue);
    return velocity < dumpingPrecision && delta < dumpingPrecision;
  }

  function roundNumber(value: number) {
    return Math.round(value * roundingPrecision) / roundingPrecision;
  }

  function switchValueDirection(): void {
    const valuesArray = [props.from, lastDesiredValue];
    state.desiredValue = getFarestValue(valuesArray, state.currentValue);
  }

  return output;
}
