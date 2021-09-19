<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper" @keydown.esc="close">
      <a-input
        ref="valueInput"
        :style="`width: ${width}px`"
        v-model="value"
        @change="handleChange"
        @pressEnter="check"
        :size="size || ''"
      />
      <a-button size="small" type="primary" icon="check" @click="check" />
      <a-button size="small" type="dashed" icon="close" @click="close" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <a-tooltip title="Nhấn để sửa" :mouseLeaveDelay="0">
        {{ value || "" }}
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
      </a-tooltip>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import updateFieldProduct from "@/gql/mutations/updateFieldProduct.gql";

@Component({})
export default class MediaEditableOrderNo extends Vue {
  @Prop() id: number;
  @Prop() text: string;
  @Prop() size: string;
  @Prop() width: string;

  value: string;
  editable: boolean = false;

  $refs: {
    valueInput: HTMLFormElement;
  };

  handleChange(e) {
    const value = e.target.value;
    this.value = value;
  }

  async check() {
    const myOrderNo = +this.value
    if (isNaN(myOrderNo)) {
      return this.$message.warning('Vui lòng nhập số');
    }

    this.editable = false;

    const r = await this.$apollo.mutate({
      mutation: updateFieldProduct,
      variables: {
        id: this.id,
        fields: { "order_no": +this.value }
      }
    });

    if (r['data'] && r['data']['update_products']['affected_rows'] > 0) {
      this.$message.success('Cập nhật thứ tự hiển thị thành công');
      this.$emit("change", this.value);
    } else {
      this.$message.error('Không thể cập nhật thứ tự hiển thị');
    }
  }

  edit() {
    this.editable = true;
    this.$nextTick(() => {
      this.$refs.valueInput.focus();
    });
  }

  close() {
    this.editable = false;
  }

  created() {
    this.value = this.text;
  }
}
</script>