<template>
  <div>
    <nuxt :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class DefaultLayout extends Vue {
 
}
</script>

<style lang="scss">

</style>
