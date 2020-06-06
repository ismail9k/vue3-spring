import springCore from '../lib/core';

import { isNumber, isObject } from '../lib/utils';
import { reactive, watchEffect, isReactive, isRef } from 'vue';

import { SpringProps, SpringValue } from '../types';

export default function spring(springValue: SpringValue, props: SpringProps) {
  const springConfig = { to: springValue, ...props };
  let output: any;

  // if there is only one value
  if (!springValue || isNumber(springValue)) {
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;
    output = springCore(springConfig);
  }
  // if the passed value is ref
  else if (isRef(springValue)) {
    springConfig.to = springValue.value;
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;

    output = springCore(springConfig);
  }
  // if the sprint has more than one variable
  else if (isObject(springValue)) {
    const keys = Object.keys(springValue);
    if (!keys.length) {
      throw new Error('[spring] can not find any values');
    }

    const springs = keys.reduce((obj: any, key) => {
      springConfig.to = springValue[key];
      springConfig.from = props?.from?.[key] || 0;

      obj[key] = springCore(springConfig);
      return obj;
    }, {});

    output = reactive(springs);
  }

  // watch reactive variables changes
  if (isReactive(springValue)) {
    watchEffect(() => {
      Object.entries(springValue).forEach(([key, value]) => {
        output[key] = value;
      });
    });
  } else if (isRef(springValue)) {
    watchEffect(() => (output.value = springValue.value));
  }

  return output;
}
