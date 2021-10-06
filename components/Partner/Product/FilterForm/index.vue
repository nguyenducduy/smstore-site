<template>
  <div class="row">
    <div class="mb-5 col-lg-12">
      <a-form :form="form" layout="horizontal" :colon="false" class="filter-form">
        <!-- <a-form-item>
          <a-input
            allowClear
            v-decorator="['q', { initialValue: '' }]"
            placeholder="Tìm trong tên sp, từ khóa, ..."
            @pressEnter="onSubmit"
          >
            <a-icon slot="prefix" type="search" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item> -->
        <a-form-item>
          <a-input
            allowClear
            v-decorator="['ids', { initialValue: '' }]"
            placeholder="Lọc theo ID: 1,2,3..."
            @pressEnter="onSubmit"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="Danh mục">
          <a-tree-select
            v-decorator="[
              'categories',
              { initialValue: [] }
            ]"
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            treeDefaultExpandAll
            :replaceFields="replaceFields"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="categories"
            tree-default-expand-all
            allow-clear
            multiple
            placeholder="Chọn danh mục"
          ></a-tree-select>
        </a-form-item>
        <!-- <a-form-item label="Loại">
          <a-select
            show-search
            v-decorator="[
              'type',
              { initialValue: [] }
            ]"
            placeholder="Chọn loại"
          >
            <a-select-option
              v-for="type in media_type"
              :value="type.value"
              :key="type.value"
              >{{ type.description }}</a-select-option
            >
          </a-select>
        </a-form-item> -->
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
        <a-form-item label="Còn hàng?">
          <a-radio-group v-decorator="['in_stock']">
            <a-radio :value="true">
              Còn
            </a-radio>
            <a-radio :value="false">
              Không
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div class="col-lg-12">
      <a-form-item>
        <a-button
          class="mr-4"
          type="primary"
          :loading="loading"
          @click.prevent="onSubmit"
          >Lọc</a-button
        >
        <a-button @click.prevent="onReset"
          >Clear</a-button
        >
      </a-form-item>
    </div>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { initQs } from '@/helper/paginate';

import fetchProductCategories from "@/gql/queries/fetchProductCategories.gql";
// import fetchMediaType from "@/apollo/queries/fetchMediaType.gql";
// import searchMedia from "@/apollo/queries/searchMedia.gql";

@Component({
  
})
export default class PartnerProductFilterForm extends Vue {
  categories: any = null
  form: any = {};
  loading: boolean = false;
  replaceFields: any = {
    children: "children",
    title: "name",
    key: "id",
    value: "id"
  };

  onReset() {
    this.$router.push('/partner/product');
  }

  onSubmit(e) {
    e.preventDefault();

    this.form.validateFields(async (err, values) => {
      if (!err) {        
        let where: any = {}
        let queryString: string = '';

        if (typeof values.ids !== 'undefined' && values.ids.length > 0) {
          where['id'] = {
            _in: values.ids.split(',').map(id => id.trim())
          }
        }

        if (values.categories.length > 0) {
          where['categories'] = {
            category_id: {
              _in: values.categories
            }
          }
        }

        // if (values.types.length > 0) {
        //   where['_type'] = {
        //     value: {
        //       _in: values.types
        //     }
        //   }
        // }

        if (typeof values.is_active !== 'undefined') {
          where['is_active'] = {
            _eq: values.is_active
          }
        }

        if (typeof values.in_stock !== 'undefined') {
          where['in_stock'] = {
            _eq: values.in_stock
          }
        }

        // // search
        // if (typeof values.q !== 'undefined' && values.q.length > 0) {
        //   queryString += '?q=' + values.q;

        //   try {
        //     const r = await this.$apollo.query({
        //       query: searchMedia,
        //       variables: {
        //         q: values.q
        //       }
        //     });

        //     // console.log(r['data']['search_media']);
            
        //     if (r['data']['search_media'].length > 0) {
        //       const resultIds = r['data']['search_media'].map(item => item.id);
        //       // console.log(r['data']['search_media']);
        //       queryString += `&sr=${resultIds.join(',')}`;
              
        //       where['id'] = {
        //         _in: r['data']['search_media'].map(item => item.id)
        //       }
        //     } else {              
        //       this.form.setFieldsValue({
        //         ids: ''
        //       })
        //       where['id'] = {
        //         _in: []
        //       }
        //     }
        //   } catch (error) {
        //     // alert('search failed');
        //   }
        // }
        
        const filterEncoded = btoa(JSON.stringify(where));

        queryString = queryString +
          (typeof values.q !== 'undefined' && values.q.length > 0 ? '&' : '?') +
          `filter_by=${filterEncoded}`
        
        this.$router.push(queryString);
      }
    });
  }

  created() {
    this.form = this.$form.createForm(this);
  }

  async mounted() {
    await this._reload()

    const { currentFilters, currentSearchText } = initQs(this);  
    
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => {
        return {
          // types: this.$form.createFormField({
          //   value: typeof currentFilters['_type'] !== 'undefined' ? currentFilters['_type']['value']['_in'] : []
          // }),
          categories: this.$form.createFormField({
            value: typeof currentFilters['categories'] !== 'undefined' ? currentFilters['categories']['category_id']['_in'] : []
          }),
          ids: this.$form.createFormField({
            value: typeof currentFilters['id'] !== 'undefined' ? currentFilters['id']['_in'].join(',') : ''
          }),
          q: this.$form.createFormField({
            value: typeof currentSearchText !== 'undefined' && currentSearchText.length > 0 ? currentSearchText : ''
          })
        };
      }
    });

    await this.$helper.sleep(180);

    // need add after form builed
    if (typeof currentFilters['is_active'] !== 'undefined') {
      this.form.setFieldsValue({
        is_active: currentFilters['is_active']['_eq']
      })  
    }

    if (typeof currentFilters['in_stock'] !== 'undefined') {
      this.form.setFieldsValue({
        in_stock: currentFilters['in_stock']['_eq']
      })  
    }
  }

  async _reload() {
    let r = null
    r = await this.$apollo.query({
      query: fetchProductCategories
    })

    this.$apollo.addSmartQuery('categories', { query: fetchProductCategories })
    this.categories = r.data.categories
  }
}
</script>

<style lang="scss" scoped>

.filter-form {
  .ant-form-item {
    margin-bottom: 5px;
  }
}
</style>