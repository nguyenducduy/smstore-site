<template>
  <div class="row" v-if="categories">
    <div class="col-lg-12">
      <a-button v-if="collapsed" size="small" type="link" @click.native="toggleCollapsed">
        Mở rộng
        <a-icon type="caret-down" />
      </a-button>
      <a-button v-if="collapsed === false" size="small" type="link" @click.native="toggleCollapsed">
        Thu gọn
        <a-icon type="caret-up" />
      </a-button>
      <!-- <zk-table
        :data="categories"
        :columns="columns"
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :is-fold="collapsed"
      >
        <template slot="order_no_template" slot-scope="scope">
          <editable-order-no :id="scope.row.id" :text="scope.row.order_no" size="small" width="50" />
        </template>
        <template slot="is_active_template" slot-scope="scope">
          <a-tag v-if="scope.row.is_active === true" color="green">Hiện</a-tag>
          <a-tag v-else>Ẩn</a-tag>
        </template>
        <template slot="actions_template" slot-scope="scope">
          <a-button
            type="link"
            icon="edit"
            @click="$bus.$emit('categories.edit.show', scope.row.id)"
          >Sửa</a-button>
          <product-category-delete-button :id="scope.row.id" />
        </template>
      </zk-table> -->
    </div>
    <!-- <product-category-edit-form /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { Getter } from 'vuex-class'
// import ProductCategoryEditForm from "@/components/Partner/Category/EditForm/index.vue";
// import ProductCategoryDeleteButton from "@/components/Partner/Category/DeleteButton/index.vue";
// import EditableOrderNo from "@/components/Partner/Category/EditableOrderNo/index.vue";

import fetchCategories from "@/gql/queries/fetchProductCategories.gql";

@Component({
  components: {
    // ProductCategoryEditForm,
    // ProductCategoryDeleteButton,
    // EditableOrderNo
  }
})
export default class PartnerProductCategoriesItems extends Vue {
  @Getter('users/shopId') shopId

  categories: any = null
  collapsed: boolean = false;

  //table columns
  columns: any = [
    {
      label: "#",
      prop: "id",
    },
    {
      label: "Tên",
      prop: "name",
    },
    {
      label: "Thứ tự hiển thị",
      type: "template",
      template: "order_no_template",
      align: "center"
    },
    {
      label: "Slug",
      prop: "slug"
    },
    {
      label: "Trạng thái",
      prop: "is_active",
      type: "template",
      template: "is_active_template",
      align: "center"
    },
    {
      label: "",
      type: "template",
      template: "actions_template",
      align: "right",
    },
  ]

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  // onCheck(row, rowIndex, $event) {
  //   // console.log(rowIndex);
  // }

  async mounted() {
    console.log(this.shopId);
    
    const r = await this.$apollo.query({
      query: fetchCategories
    })
    console.log(r);
    

    // if (r.data) {
    //   this.categories = r.data.categories
    // }

    // this.$bus.$on('categories.reload', () => {
    //   this.$apollo.queries.categories.refetch();
    // })
  }
}

</script>

<style>
.zk-table {
  font-size: 14px !important;
  border: none !important;
}
.zk-table__header-row {
  background-color: #fff !important;
}
.zk-table__header-cell {
  font-weight: 500 !important;
}
</style>