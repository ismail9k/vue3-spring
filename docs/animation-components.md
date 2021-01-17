
# Animation Components

Components for the ones who prefer the template-based way

## SpringProvider

`SpringProvider` accepts [props](/vue3-spring/animation-functions#spring-props) same the [`spring`](/vue3-spring/animation-functions#spring) function

### Using

#### Single Value

```vue
<template>
  <spring-provider v-slot="{ value }" :to="positionX" :damping="10">
    <div class="circle" :style="{ transform: `translateX(${value}px)` }"></div>
  </spring-provider>
</template>

<script>
import { SpringProvider } from 'vue3-spring';

export default {
  name: 'App',
  components: { SpringProvider },
  data: () => ({
    positionX: 100,
  }),
};
</script>
```

#### Multiple Values

```vue
<template>
  <spring-provider v-slot="{ x, y }" :to="mouse" :damping="10">
    <div class="circle" :style="{ transform: `translate(${x}px, ${y}px)` }"></div>
  </spring-provider>
</template>

<script>
import { SpringProvider } from 'vue3-spring';

export default {
  name: 'App',
  components: { SpringProvider },
  data: () => ({
    mouse: { x: 0, y: 0 },
  }),
};
</script>
```

## ParallaxProvider

### COMING SOON

## PresentProvider

### COMING SOON
