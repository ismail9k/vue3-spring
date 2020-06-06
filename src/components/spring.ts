import springCore from '../lib/core';

import { isNumber, isObject } from '../lib/utils';
import { reactive, watchEffect, isReactive, isRef } from 'vue';

import { SpringProps, SpringData } from '../types';

export default function spring(desiredValue: SpringData, props: SpringProps) {
  const springConfig = { to: desiredValue, ...props };
  let output: any;

  // if there is only one value
  if (!desiredValue || isNumber(desiredValue)) {
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;
    output = springCore(springConfig);
  }
  // if the passed value is ref
  else if (isRef(desiredValue)) {
    springConfig.to = desiredValue.value;
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;

    output = springCore(springConfig);
  }
  // if the sprint has more than one variable
  else if (isObject(desiredValue)) {
    const keys = Object.keys(desiredValue);
    if (!keys.length) {
      throw new Error('[spring] can not find any values');
    }

    const springs = keys.reduce((obj: any, key) => {
      springConfig.to = desiredValue[key];
      springConfig.from = props?.from?.[key] || 0;

      obj[key] = springCore(springConfig);
      return obj;
    }, {});

    output = reactive(springs);
  }

  // watch reactive variables changes
  if (isReactive(desiredValue)) {
    watchEffect(() => {
      Object.entries(desiredValue).forEach(([key, value]) => {
        output[key] = value;
      });
    });
  } else if (isRef(desiredValue)) {
    watchEffect(() => (output.value = desiredValue.value));
  }

  return output;
}
