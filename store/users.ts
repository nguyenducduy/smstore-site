import Vue from "vue";

export const state = () => ({
    total: 0,
    token: null,
    fcmToken: null,
    loggedUser: null,
    favorites: [],
    shop: null
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
    },
    SET_SHOP(state, shop) {
      state.shop = shop
    }
  }
  
  export const actions = {
    
  };
  
  export const getters = {
    loggedShop(state) {
      return state.shop || null
    },
    shopId(state) {
      return +state.loggedUser['https://hasura.io/jwt/claims']['x-hasura-store-id'] || 0
    },
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