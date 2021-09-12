<template>
  <div class="row">
    <div class="col-lg-12" v-if="types">
      <a-tabs :default-active-key="types[0]['id']" @change="onChangeTabType">
        <a-tab-pane :tab="type.name" v-for="type in types" :key="type.id">
          <div class="flex justify-between mb-4">
            <a-button  icon="plus" @click="$bus.$emit('attributes.add.show', type.id, type.name)">Thêm thuộc tính</a-button>
            <a-button type="danger" icon="delete" @click="$bus.$emit('attributes.add.show', type.id, type.name)">Xóa</a-button>
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
            <template slot="_actions" slot-scope="record">
              <!-- <a-button
                type="link"
                icon="edit"
                @click="$bus.$emit('user.edit.show', record.id)"
              >Sửa</a-button>
              <user-delete-button :id="record.id" /> -->
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs> 
    </div>
    <!-- <user-edit-form /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
// import { getOrderBy, getFilterBy, initQs, createUrl } from "@/helper/index";
// import UserEditForm from "@/components/Admin/User/EditForm/index.vue";
// import UserDeleteButton from "@/components/Admin/User/DeleteButton/index.vue";
// import Bulk from "@/components/Admin/User/Bulk/index.vue";
// import UserFilterForm from "@/components/Admin/User/FilterForm/index.vue";

import fetchProductTypes from "@/gql/queries/fetchProductTypes.gql";
// import countUsers from "@/apollo/queries/countUsers.gql";

@Component({
  // components: {
  //   UserEditForm,
  //   UserDeleteButton,
  //   Bulk,
  //   UserFilterForm
  // },
  apollo: {
    types: {
      prefetch: true,
      query: fetchProductTypes
    }
  }
})
export default class PartnerProductAttributeItems extends Vue {
  // @Watch('users_aggregate')
  // onUserAggregateChange() {
  //   this.$bus.$emit('bc.total', this.users_aggregate.aggregate.count); 
  // }

  types: any = null;
  users: any = null;
  users_aggregate: any = null;

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

  get total() {
    if (this.users_aggregate) {
      return this.users_aggregate.aggregate.count;
    } else {
      return 0;
    }
  }

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
        width: '100px'
      },
      {
        title: "Tên TT",
        dataIndex: "name",
        key: "name", // sort with field in model
        sorter: true,
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
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

