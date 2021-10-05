<template>
  <div class="row">
    <div class="col-lg-6" v-if="types && types.length > 0">
      <a-tabs :default-active-key="types[0]['id']" @change="onChangeTabType">
        <a-tab-pane :tab="type.name" v-for="type in types" :key="type.id">
          <div class="flex justify-between mb-4">
            <a-button  icon="plus" @click="$bus.$emit('attributes.add.show', type.id, type.name)">Thêm thuộc tính</a-button>
            <partner-type-delete-button :id="type.id" />
          </div>
          
          <a-table
            size="small"
            :dataSource="type.attributes"
            :columns="columns"
            :pagination="false"
            :rowKey="record => record.id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"  
          >
            <template slot="_name" slot-scope="record">
              <partner-attribute-editable-name :id="record.id" :text="record.name" size="small" width="70%" />
            </template>
            <template slot="_orderNo" slot-scope="record">
              <partner-attribute-editable-order-no :id="record.id" :text="record.order_no" size="small" width="50" />
            </template>
            <template slot="_actions" slot-scope="record">
              <!-- <a-button
                type="link"
                icon="edit"
                @click="$bus.$emit('user.edit.show', record.id)"
              >Sửa</a-button> -->
              <partner-attribute-delete-button :id="record.id" />
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs> 
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator"
// import { getOrderBy, getFilterBy, initQs, createUrl } from "@/helper/index";
// import UserEditForm from "@/components/Admin/User/EditForm/index.vue";
import PartnerAttributeDeleteButton from "@/components/Partner/Attribute/DeleteButton/index.vue"
import PartnerAttributeEditableOrderNo from "@/components/Partner/Attribute/EditableOrderNo/index.vue"
import PartnerAttributeEditableName from "@/components/Partner/Attribute/EditableName/index.vue"
import PartnerTypeDeleteButton from "@/components/Partner/Type/DeleteButton/index.vue"
// import Bulk from "@/components/Admin/User/Bulk/index.vue";
// import UserFilterForm from "@/components/Admin/User/FilterForm/index.vue";

import fetchProductTypes from "@/gql/queries/fetchProductTypes.gql";
// import countUsers from "@/apollo/queries/countUsers.gql";

@Component({
  components: {
    // UserEditForm,
    PartnerAttributeDeleteButton,
    PartnerAttributeEditableOrderNo,
    PartnerTypeDeleteButton,
    PartnerAttributeEditableName
    // Bulk,
    // UserFilterForm
  },
  apollo: {
    types: {
      query: fetchProductTypes
    }
  }
})
export default class PartnerProductAttributeItems extends Vue {
  types: any = null;
 
  // items per page
  pageSize: number = 30;
  currentPage: number = 1;

  //loading state
  loading: boolean = false;
  
  //sort
  sortedInfo: any = null;

  // filter mode
  filterable: boolean = false;
 
  //search
  q: string = '';

  //table properties
  selectedRowKeys: any = [];

  bulkActions: any = [
    { action: "delete", label: "Xóa" },
    { action: "block", label: "Khóa" },
  ];

  get hasSelected() {
    return this.selectedRowKeys.length > 0;
  }

  //table properties
  get columns() {
    let { sortedInfo } = this;
    sortedInfo = sortedInfo || {};

    const columns: any = [
      {
        title: "#",
        dataIndex: "id",
        key: "id", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
      },
      {
        title: "Tên TT",
        key: "name", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        scopedSlots: { customRender: "_name" }
      },
      {
        title: "TTHT",
        key: "order_no", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "order_no" && sortedInfo.order,
        scopedSlots: { customRender: "_orderNo" },
        align: "center",
      },
      {
        align: "right",
        width: 200,
        scopedSlots: { customRender: "_actions" }
      }
    ];

    return columns;
  }

  onChangeTabType(key) {
    console.log(key);
  }

  //table select event
  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }

  mounted() {
    this.__reload();
    
    // event hook
    this.$bus.$on('types.reload', () => {
      this.__reload();
      this.selectedRowKeys = [];
    });
  }

  async __reload() {
    this.loading = true;
    await this.$apollo.queries.types.refetch();
    this.loading = false;
  }

}
</script>

