import Vue from 'vue'

export const state = () => ({
  pageSize: 20,
})

export const mutations = {
  SET_PAGE_SIZE(state, pageSize) {
    state.pageSize = pageSize
    Vue.ls.set('banners.pageSize', pageSize);
    this.$cookiz.set('banners.pageSize', pageSize);
  }
}

export const actions = {
  
};

export const getters = {
  pageSize(state) {
    return state.pageSize
  }
};