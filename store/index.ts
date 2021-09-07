export const state = () => {
};

export const actions = {
 
};

export const mutations = {
  SET(state, payload) {
    state[payload.app] = payload.value;
  }
};
  

export const getters = {
  openKeys(state) {
    return state["menu.openedKeys"] || [];
  },
  selectedKeys(state) {
    return state["menu.selectedKeys"] || [];
  }
};