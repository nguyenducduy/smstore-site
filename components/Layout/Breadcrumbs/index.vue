<template>
  <div class="mb-4">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, i) in data" :key="i" class="text-xl">
        <nuxt-link :to="item.url" v-if="item.active === false">
          <i :class="item.icon" class="mr-2"></i> {{ item.title }}
        </nuxt-link>
        <span v-else>
          {{ item.title }}
          <span v-if="total > 0 && item.active">({{ total | number('0,0') }})</span>
        </span>
        <a-menu slot="overlay" v-if="item.sub">
          <a-menu-item v-for="(x,i) in item.sub" :key="i" class="text-center">
            <nuxt-link :to="x.url">
              <a-icon :type="x.icon" />
              {{ x.name }}
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-breadcrumb-item>      
    </a-breadcrumb>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";

@Component({
  name: "breadcrumbs"
})
export default class Breadcrumbs extends Vue {
  @Prop() data;

  get total() {
    return this.val;
  }
  val: number = 0;

  mounted() {
    this.$bus.$on("bc.total", val => {
      this.val = val;
    });
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
