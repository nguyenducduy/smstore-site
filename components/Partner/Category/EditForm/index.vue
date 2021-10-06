<template>
  <div>
    <a-drawer
      placement="right"
      :visible="visible"
      width="25%"
      @close="onClose"
    >
      <template slot="title">
        Sửa danh mục
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
                  <a-radio-group v-decorator="['is_active']">
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

import updateProductCategory from "@/gql/mutations/updateProductCategory.gql";
import fetchProductCategories from "@/gql/queries/fetchProductCategories.gql";
import fetchProductCategory from "@/gql/queries/fetchProductCategory.gql";

@Component({})
export default class PartnerProductCategoryEdit extends Vue {
  @Getter('users/shopId') shopId
  
  categories: any = null
  categories_by_pk: any = {}
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
          const r = await this.$apollo.mutate({
            mutation: updateProductCategory,
            variables: {
              id: this.categories_by_pk.id,
              parent_id: values.parent_id,
              name: values.name,
              slug: `${this.$helper.getSlug(values.name)}-${this.shopId}`,
              is_active: values.is_active
            },
          });

          this.loading = false;
          this.$message.success(`Danh mục ${values.name} đã được cập nhật`);
          this.$bus.$emit('categories.reload')
        } catch (error) {
          this.loading = false;
        }
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this);
  }

  async mounted() {
    await this._reload()
    
    this.$bus.$on("categories.edit.show", async id => {
      try {
        const r = await this.$apollo.query({
          query: fetchProductCategory,
          variables: { id: id }
        });

        this.categories_by_pk = r.data.categories_by_pk;
        
        this.form = this.$form.createForm(this, {
          mapPropsToFields: () => {
            return {
              parent_id: this.$form.createFormField({
                value: this.categories_by_pk.parent_id
              }),
              name: this.$form.createFormField({
                value: this.categories_by_pk.name
              }),
              slug: this.$form.createFormField({
                value: this.categories_by_pk.slug
              }),
              is_active: this.$form.createFormField({
                value: this.categories_by_pk.is_active
              })
            };
          }
        });

        this.visible = true;
      } catch (error) {
        
      }
    });
  }

  async _reload() {
    const r = await this.$apollo.query({
      query: fetchProductCategories
    })

    this.$apollo.addSmartQuery('categories', { query: fetchProductCategories })
    this.categories = r.data.categories
  }
}
</script>