<template>
  <div class='container'>
    <div class='header'>
      <div class='balance'>
        <h5 class='grey nomargin'>Total balance</h5>
        <h1 class='nomargin'>
          <span class='grey'>&#x20BF;</span> 2.363
          <span class='subtitle'>($19,463.31)</span>
        </h1>
      </div>
      <div class='network'>
        <span>{{ networkName }}</span>
        <div class='network-status success' />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { HDNode } from "bitcoinjs-lib";
import { mapState } from "vuex";
export default {
  name: "Dashboard",
  mounted() {
    if (!this.node) {
      this.$router.push("/dashboard/load");
    }
  },
  computed: {
    networkName: function() {
      if (!this.node) return null;
      switch (this.node.keyPair.network.bech32) {
        case "tb":
          return "Testnet";
        case "bc":
          return "Mainnet";
        default:
          return "Unknown";
      }
    },
    ...mapState({
      // @ts-ignore
      node: state => state.node
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/_colors";
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  border-bottom: 1px solid $black;
}
.balance {
  flex-basis: 80%;
}
.network {
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem;
  flex-basis: 20%;
  position: relative;
  padding-right: 0.75rem;
}
.network-status {
  height: 1rem;
  width: 1rem;
  border-radius: 1rem;
  background: #77dd77;
  position: relative;
  transform: translate(0.5rem, 0.25rem);
  box-sizing: border-box;
  border: 1px solid $black;
}
</style>
