<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        ref="valueInput"
        :style="`width: ${width}`"
        v-model="value"
        @change="handleChange"
        @pressEnter="check"
        :size="size || ''"
      />
      <a-button size="small" type="primary" icon="check" @click="check" />
      <a-button size="small" type="link" icon="close-circle" @click="close" />
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

import updateFieldProductAttribute from "@/gql/mutations/updateFieldProductAttribute.gql";

@Component({})
export default class ProductAttributeEditableName extends Vue {
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
    this.editable = false;

    const r = await this.$apollo.mutate({
      mutation: updateFieldProductAttribute,
      variables: {
        id: this.id,
        fields: { "name": this.value }
      }
    });

    if (r['data'] && r['data']['update_attributes']['affected_rows'] > 0) {
      this.$message.success('Cập nhật tên thuộc tính thành công');
      this.$emit("change", this.value);
    } else {
      this.$message.error('Không thể cập nhật tên thuộc tính');
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