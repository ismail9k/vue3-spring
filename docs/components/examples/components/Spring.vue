<template>
  <spring-provider v-slot="{ value }" :to="positionX" :damping="10">
    <div class="circle" :style="{ transform: `translateX(${value}px)` }"></div>
    <div class="text--center">{{ value }}</div>
  </spring-provider>
</template>

<script>
import { SpringProvider } from '../../../../dist/spring.es';

export default {
  name: 'App',
  components: { SpringProvider },
  data: () => ({
    positionX: 500,
  }),
  created() {
    let flag = false;
    setInterval(() => {
      flag = !flag;
      if (!flag) return (this.positionX = 500);
      this.positionX = 0;
    }, 1500);
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