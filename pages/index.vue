<template>
  <div v-lazy-container="{ selector: 'img' }">
    <p>homepage</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'default',
})
export default class HomePage extends Vue {
  mounted() {
    if (process.client) {
      window.scrollTo({ top: 0 })
    }
    
  }
}
</script>

