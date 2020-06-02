import springCore from '../lib/core';

import { isNumber } from '../lib/utils';
import { reactive } from 'vue';

import { SpringProps } from '../types';

export default function spring(props: SpringProps | number) {
  // if there is only one value
  if (!props || isNumber(props) || isNumber(props.to)) {
    const springConfig = isNumber(props) ? ({} as SpringProps) : { ...props };
    springConfig.from = isNumber(springConfig.from) ? springConfig.from : 0;
    return springCore(springConfig);
  }

  // if the sprint has more than one variable
  const values = Object.keys(props.to);
  if (!values.length) {
    throw new Error('[spring] can not find any values');
  }
  const springs = values.reduce((obj: any, key) => {
    const springConfig = { ...props };
    springConfig.to = props.to[key];
    springConfig.from = props?.from?.[key] || 0;

    obj[key] = springCore(springConfig);
    return obj;
  }, {});
  return reactive(springs);
}
