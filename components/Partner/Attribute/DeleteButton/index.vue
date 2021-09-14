<template>
  <a-popconfirm
    okText="Đồng ý"
    cancelText="Hủy"
    placement="left"
    @confirm="onDelete"
    width="100px"
  >
    <template slot="title">
      Bạn đã chắc?
      <a-alert type="warning" message="Tất cả giá trị đã tạo trước đó của thuộc tính này sẽ bị xóa vĩnh viễn."></a-alert>
    </template>
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
import deleteProductAttribute from "@/gql/mutations/deleteProductAttribute.gql";

@Component({})
export default class ProductAttributeDeleteButton extends Vue {
  @Prop() id: number;

  loading: boolean = false;

  async onDelete() {
    this.loading = true;
    
    try {
      await this.$apollo.mutate({
        mutation: deleteProductAttribute,
        variables: {
          id: this.id
        }
      });

      this.loading = false;
      this.$bus.$emit('types.reload');
      this.$message.success('Xóa ID: ' + this.id + ' thành công');
    } catch (error) {
      this.loading = false;
    }
  }
}
</script>