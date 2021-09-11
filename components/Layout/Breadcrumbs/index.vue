<template>
  <div :class="$style.breadcrumbs">
    <div :class="$style.path">
      <template v-for="(item, index) in data">
        <span :key="index" class="text-2xl">
          <i :class="item.icon" class="mr-2"></i>
          <span class="font-weight-normal" v-if="item.active">
            {{ item.title }}
            <span v-if="total > 0 && item.active">({{ total | number('0,0') }})</span>
          </span>
          <span v-else>
            <router-link :to="item.url">{{ item.title }}</router-link>
          </span>
          <span v-if="!item.active" :class="$style.arrow"></span>
        </span>
      </template>
    </div>
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
