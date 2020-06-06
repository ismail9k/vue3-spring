import springCore from '../lib/core';

import { isNumber, isObject } from '../lib/utils';
import { reactive, watchEffect, isReactive, isRef } from 'vue';

import { SpringProps } from '../types';

export default function spring(props: SpringProps) {
  const springConfig = { ...props };
  let output: any;

  // if there is only one value
  if (!props || isNumber(props.to)) {
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;
    output = springCore(springConfig);
  }
  // if the passed value is ref
  else if (isRef(props.to)) {
    springConfig.to = props.to.value;
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;

    output = springCore(springConfig);
  }
  // if the sprint has more than one variable
  else if (isObject(props.to)) {
    const keys = Object.keys(props.to);
    if (!keys.length) {
      throw new Error('[spring] can not find any values');
    }

    const springs = keys.reduce((obj: any, key) => {
      springConfig.to = props.to[key];
      springConfig.from = props?.from?.[key] || 0;

      obj[key] = springCore(springConfig);
      return obj;
    }, {});

    output = reactive(springs);
  }

  // watch reactive variables changes
  if (isReactive(props.to)) {
    watchEffect(() => {
      Object.entries(props.to).forEach(([key, value]) => {
        output[key] = value;
      });
    });
  } else if (isRef(props.to)) {
    watchEffect(() => (output.value = props.to.value));
  }

  return output;
}
