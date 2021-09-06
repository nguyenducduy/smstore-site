export default function ({
  $axios,
  store,
  redirect,
  $config: {
    NUXT_ENV_GUEST_TOKEN,
    NUXT_ENV_TRACKING_URL
  }
}) {
  $axios.onRequest(config => {
    // console.log('Making request to ' + config.url);
    // console.log(store.state.users.token);
    if (store.state.users.token !== null) {
      config.headers = {
        Authorization: "Bearer " + store.state.users.token
      }
    } else {
      config.headers = {
        Authorization: "Bearer " + NUXT_ENV_GUEST_TOKEN
      }
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    console.log(error.response);
  })
}