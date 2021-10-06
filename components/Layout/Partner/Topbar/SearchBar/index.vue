<template>
  <v-autocomplete
    :items="results"
    :component-item='template'
    @update-items="onSearch"
    :min-len='1'
    :wait="100"
    :value='q'
    :auto-select-one-item="false"
    :get-label="getLabel"
    :input-attrs="inputAttrs"
  >
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Getter } from 'vuex-class'
import { MeiliSearch } from 'meilisearch'
import ItemTemplate from './ItemTemplate.vue'

@Component({})
export default class SearchBar extends Vue {
  @Getter('users/shopId') shopId

  results: any = []
  template: any = ItemTemplate
  q: string = ''
  inputAttrs = {
    placeholder: "Tìm sản phẩm",
    class: "border-2 border-gray-200 bg-white h-10 px-5 pr-16 rounded-lg focus:outline-none w-64"
  }

  get index() {
    return 'productStore' + this.shopId
  }

  getLabel(item) {
    return item.name
  }

  searchClient: any = null

  created() {
    this.searchClient = new MeiliSearch({
      host: this.$config.NUXT_ENV_MEILISEARCH_URL,
      apiKey: this.$config.NUXT_ENV_MEILISEARCH_API_KEY
    })
  }

  async onSearch(q) {
    const index = this.searchClient.index(this.index)
    const r = await index.search(q, {
      attributesToHighlight: ['*'],
    })

    if (r.hits.length > 0) {
      this.results = r.hits
    }    
  }
}
</script>

<style lang="scss">
.v-autocomplete-list {
  width: 500px;
  z-index: 999;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  // padding: 0.6rem;
}
</style>