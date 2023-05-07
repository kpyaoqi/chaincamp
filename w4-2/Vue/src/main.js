// import Vue from 'vue'
// import App from './App.vue'

// Vue.config.productionTip = false

// new Vue({render: h => h(App),}).$mount('#app')

import { createApp, h } from 'vue'

import App from './App.vue'

import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  cache,
  uri: 'https://api.thegraph.com/subgraphs/name/kpyaoqi/w4-2',
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp({
  render: () => h(App),
})

app.use(apolloProvider)
app.mount('#app')