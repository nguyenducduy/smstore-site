import Vue from "vue";

export const state = () => ({
    total: 0,
    token: null,
    fcmToken: null,
    loggedUser: null,
    favorites: []
  })
  
  export const mutations = {
    SET_AUTH(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.loggedUser = user;
    },
    SET_FAVORITES(state, items) {
      state.favorites = items;
    },
    SET_FCM_TOKEN(state, token) {
      state.fcmToken = token;
    }
  }
  
  export const actions = {
    
  };
  
  export const getters = {
    isAuth(state) {
      if (typeof state.token === 'undefined' || state.token === null) {
        return false;
      } else {
        return true;
      }
    },
    loggedUser(state) {
      return state.loggedUser || null;
    },
    loggedToken(state) {
      return state.token || null;
    },
    favoriteds(state) {
      return state.favorites || [];
    },
    registeredFcmToken(state) {
      return state.fcmToken;
    },
    isRegisteredFcmToken(state) {
      if (typeof state.fcmToken === 'undefined' || state.fcmToken === null) {
        return false;
      } else {
        return true;
      }
    }
  };