import {
  ApolloLink,
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
    NUXT_ENV_GUEST_TOKEN,
    NUXT_ENV_GRAPHQLWS_URI
  }
}) {  
  const errorLink = onError(error => {
    console.log(error);
    //fix when a media is deleted.
    if (error['graphQLErrors']) {
      message.error(
        error['graphQLErrors'][0]['message'],
        5
      );
    }
  })
  
  // console.info('guest token: ', NUXT_ENV_GUEST_TOKEN);
  // console.log('Current environment is: ', env.NODE_ENV);
  console.info('Connected to GraphQL server at: ', NUXT_ENV_GRAPHQL_URI);

  let token = app.$cookiz.get('token');
  console.log(token);
  
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
      },
    })]),
    wsEndpoint: NUXT_ENV_GRAPHQLWS_URI,
    connectToDevTools: true
  } 
}