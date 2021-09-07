<template>
  <div>
    <Nuxt :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component
export default class LoginLayout extends Vue {
  
}
</script>

