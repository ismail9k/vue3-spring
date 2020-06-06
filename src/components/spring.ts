import springCore from '../lib/core';

import { isNumber, debounce } from '../lib/utils';
import { reactive, watchEffect, isReactive } from 'vue';

import { SpringProps } from '../types';

export default function spring(props: SpringProps | number) {
  // if there is only one value
  if (!props || isNumber(props) || isNumber(props.to)) {
    const springConfig = isNumber(props) ? ({} as SpringProps) : { ...props };
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;
    return springCore(springConfig);
  }

  // if the sprint has more than one variable
  const keys = Object.keys(props.to);
  if (!keys.length) {
    throw new Error('[spring] can not find any values');
  }

  const springs = keys.reduce((obj: any, key) => {
    const springConfig = { ...props };
    springConfig.to = props.to[key];
    springConfig.from = props?.from?.[key] || 0;

    obj[key] = springCore(springConfig);
    return obj;
  }, {});

  const output = reactive(springs);

  if (isReactive(props.to)) {
    watchEffect(() => {
      Object.entries(props.to).forEach(([key, value]) => {
        output[key] = value;
      });
    });
  }

  return output;
}
