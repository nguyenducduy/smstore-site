import {
  ApolloLink,
  InMemoryCache
} from "apollo-boost";
import { onError } from "apollo-link-error";
import fetch from 'isomorphic-fetch';
import { createHttpLink } from "apollo-link-http";
import jwtDecode from 'jwt-decode';
import { message } from "ant-design-vue";

export default function({
  app,
  redirect,
  store,
  $config: {
    NUXT_ENV_GRAPHQL_URI,
    NUXT_ENV_GRAPHQLWS_URI
  }
}) {  
  const errorLink = onError(error => {
    console.log(error);
    //fix when a media is deleted.
    if (error['graphQLErrors']) {
      const msg = error.graphQLErrors[0]['message'];

      if (msg.includes(`categories_slug_key`)) {
        message.error("Danh mục SP này đã tồn tại.");            
      } else if (msg.includes(`products_type_id_fkey`)) {
        message.error("Không thể xóa loại vì có sản phẩm đang sử dụng loại này.")
      }
      else {
        message.error(msg, 5);
      }
    }
  })
  
  // console.log('Current environment is: ', env.NODE_ENV);
  console.info('Connected to GraphQL server at: ', NUXT_ENV_GRAPHQL_URI);

  let token = app.$cookiz.get('token');
  // console.log(token);
  
  return {
    defaultHttpLink: false,
    link: ApolloLink.from([errorLink, createHttpLink({
      credentials: 'include',
      uri: NUXT_ENV_GRAPHQL_URI,
      fetch: (uri, options) => {
        if (typeof token !== 'undefined') {
          const user = jwtDecode(token);
          options.headers['X-Hasura-Role'] = user['https://hasura.io/jwt/claims']['x-hasura-role'];
          options.headers['X-Hasura-User-Id'] = user['sub'];
          options.headers['Authorization'] = 'Bearer ' + token;
        }

        return fetch(uri, options)
      }
    })]),
    cache: new InMemoryCache(),
    wsEndpoint: NUXT_ENV_GRAPHQLWS_URI,
    connectToDevTools: true
  } 
}