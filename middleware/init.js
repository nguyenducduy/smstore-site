import Vue from 'vue';
import jwtDecode from 'jwt-decode';

export default function({ app, store }) {
  const token = process.server ? app.$cookiz.get('token') : Vue.ls.get('token');
  
  if (typeof token !== 'undefined' && token !== null) {
    const user = jwtDecode(token);
  
    store.commit('users/SET_AUTH', token);
    store.commit('users/SET_USER', user);
  }
}

