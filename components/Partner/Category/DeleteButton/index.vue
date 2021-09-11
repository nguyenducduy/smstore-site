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
    >Xóa</a-button>
  </a-popconfirm>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import deleteProductCategory from "@/gql/mutations/deleteProductCategory.gql";

@Component({})
export default class ProductCategoryDeleteButton extends Vue {
  @Prop() id: number;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;

    try {
      await this.$apollo.mutate({
        mutation: deleteProductCategory,
        variables: {
          id: this.id
        }
      });

      this.loading = false;
      this.$message.success('Xóa ID: ' + this.id + ' thành công');
      this.$bus.$emit('categories.reload')
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>