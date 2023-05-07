<script>

import gql from 'graphql-tag'
export default {
  name: 'ERC721',
  apollo: {
    transfers: gql`query {
          transfers(first: 5) {
          id
          from
          to
          tokenId
        }
      }`,
  },

  data() {
    return {
      transfers: null,
    }
  },

  async created() {
  },

  methods: {
  }
}


</script>

<template>
  <div >
    <div>
    交易列表:
  </div>
      <div v-for="(item, index) in transfers" :key="index">
        <br /> 从 : {{ item.from  }}
        <br /> 到 : {{  item.to }}
        <br /> 金额 : {{  item.tokenId }}
      </div>

  </div>
</template>
