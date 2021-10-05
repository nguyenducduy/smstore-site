<template>
  <div class="text-right m-b-10">
    <a-button type="primary" icon="plus" @click="onShow">Thêm</a-button>
    <a-drawer
      placement="right"
      :visible="visible"
      width="25%"
      @close="onClose"
    >
      <template slot="title" class="bg-gray-50">
        Thêm danh mục
      </template>
      <div class="row">
        <div class="col-lg-12">
          <a-form class="mt-3" :form="form" @submit="onSubmit">
            <div class="row">
              <div class="col-lg-12">
                <a-form-item
                  label="Danh mục cha"
                >
                  <a-tree-select
                    v-decorator="['parent_id']"
                    placeholder="Chọn danh mục cha"
                    style="width: 100%"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    treeDefaultExpandAll
                    :replaceFields="replaceFields"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="categories"
                    tree-default-expand-all
                    allow-clear
                  ></a-tree-select>
                </a-form-item>
              </div>
              <div class="col-lg-12">
                <a-form-item label="Tên danh mục">
                  <a-input
                    ref="nameInput"
                    v-decorator="[
                      'name',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Vui lòng nhập tên danh mục'
                          }
                        ]
                      }
                    ]"
                  />
                </a-form-item>
              </div>
              
              <div class="col-lg-12">
                <a-form-item label="Trạng thái">
                  <a-radio-group v-decorator="['is_active', { initialValue: true }]">
                    <a-radio :value="false">
                      Ẩn
                    </a-radio>
                    <a-radio :value="true">
                      Hiện
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <div class="drawer-footer">
        <a-button class="mr-2" @click="onClose">Đóng</a-button>
        <a-button
          class="mr-2"
          icon="save"
          type="primary"
          @click="onSubmit"
          :loading="loading"
          :disabled="$helper.hasErrors(form.getFieldsError())"
          >Lưu</a-button
        >
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from 'vuex-class'

import insertProductCategory from "@/gql/mutations/insertProductCategory.gql";
import fetchProductCategories from "@/gql/queries/fetchProductCategories.gql";

@Component({
  apollo: {
    categories: {
      query: fetchProductCategories,
    }
  }
})
export default class PartnerProductCategoryAddForm extends Vue {
  @Getter('users/shopId') shopId
  
  categories: any = null
  visible: boolean = false;
  form: any = {};
  loading: boolean = false;

  $refs: {
    nameInput: HTMLFormElement;
  };
  replaceFields: any = {
    children: "children",
    title: "name",
    key: "id",
    value: "id"
  };

  onShow() {
    this.visible = true;
    this.$nextTick(() => {
      this.$refs.nameInput.focus();
    });
  }

  onClose() {
    this.visible = false;
    this.form.resetFields();
  }

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.loading = true;

        try {
          await this.$apollo.mutate({
            mutation: insertProductCategory,
            variables: {
              object: {
                store_id: this.shopId,
                parent_id: values.parent_id,
                name: values.name,
                slug: `${this.$helper.getSlug(values.name)}-${this.shopId}`,
                is_active: values.is_active,
              }
            },
          });

          this.loading = false;
          this.form.resetFields();
          this.$message.success(`Danh mục ${values.name} đã được thêm`);
          this.$apollo.queries.categories.refetch();
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this);
  }
}
</script>