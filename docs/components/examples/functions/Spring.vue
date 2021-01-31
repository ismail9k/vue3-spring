<template>
  <div class="circle" :style="{ transform: `translateX(${mySpring}px)` }"></div>
  <div class="text--center">{{ mySpring }}</div>
</template>

<script>
import { spring } from '../../../../dist/spring.es';

export default {
  name: 'App',
  setup() {
    // If you passed to the spring a number as it's value
    // it return a Vue ref object.
    const mySpring = spring(0, { damping: 10 });
    mySpring.value = 500;

    // To update the spring desired value
    let flag = false;
    setInterval(() => {
      flag = !flag;
      if (!flag) return (mySpring.value = 500);
      mySpring.value = 0;
    }, 1500);

    return { mySpring };
  },
};
</script>

<style>
.circle {
  border-radius: 50px;
  background-color: violet;
  width: 100px;
  height: 100px;
  margin: 50px 0;
}
.text--center {
  text-align: center;
}
</style>