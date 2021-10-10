<template>
  <a-popconfirm
    title="Bạn đã chắc?"
    okText="Đồng ý"
    cancelText="Hủy"
    placement="left"
    @confirm="onDelete"
  >
    <a-button
      :loading="loading"
      icon="delete"
      type="link"
      style="color: #ff0074c4"
    ></a-button>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import deleteProduct from "@/gql/mutations/deleteProduct.gql";
import fetchProductImages from '@/gql/queries/fetchProductImages.gql'

@Component({})
export default class ProductDeleteButton extends Vue {
  @Prop() id: number;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;

    const r = await this.$apollo.query({
      query: fetchProductImages,
      variables: {
        where: {
          product_id: { _eq: this.id }
        }
      }
    })
    
    try {
      await this.$apollo.mutate({
        mutation: deleteProduct,
        variables: {
          id: this.id
        }
      });
      
      if (r.data.images.length > 0) {
        r.data.images.map(async image => {
          await this.$axios.post(
            `${this.$config.NUXT_ENV_STORAGE_ENDPOINT}/products/delete`,
            {
              id: image.id,
              path: image.path
            }
          )
        })
      }

      this.loading = false;
      this.$bus.$emit('products.reload');
      this.$message.success('Xóa SP ID: ' + this.id + ' thành công');
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>