import jwtDecode from "jwt-decode";

export default async function ({ app, store, redirect }) {
  const isAuth = store.getters['users/isAuth'];
  console.log(isAuth);
  if (!isAuth) {
    return redirect('/partner/login');
  }



  // check valid token
  const user = store.getters['users/loggedUser'];
  console.log(user);
  
  // const r = await store.dispatch('users/fetchOne', user['sub']);
  // console.log(r)
}