<template>
  <div class="">
    <nuxt-link :to="`/partner/product/edit/${item.id}`">
      <span v-html="item._formatted.name"></span>
    </nuxt-link>
    <small>
      {{ item.price | number('0,0') }} &#8363;
    </small>
    <small class="text-green-600" v-if="item.in_stock">Còn hàng</small>
    <small class="text-red-600" v-if="!item.in_stock">Hết hàng</small>
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
    searchText: { required: true }
  }
}
</script>

<style>
em {
  font-style: normal;
  color: #6c5ce7
}
</style>