
# Animation Components

Components for the ones who prefer the template-based way

- [Animation Components](#animation-components)
  - [SpringProvider](#springprovider)
    - [Using](#using)
      - [Single Value](#single-value)
      - [Multiple Values](#multiple-values)
  - [ParallaxProvider](#parallaxprovider)
    - [COMING SOON](#coming-soon)
  - [PresentProvider](#presentprovider)
    - [COMING SOON](#coming-soon-1)

## SpringProvider

`SpringProvider` accepts [props](#spring-props) same the [`spring`](#spring) function

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
