<template>
  <div class="center-all">
    <div class="container text-center">
      <img src="../assets/valknut.jpg" class='logo' /><br>
      <button class='mt' @click='$router.push("/wallet/new")'>Create new wallet</button>
      <button class='mt' @click='uploadFile'>Load from file</button>
      <input class='upload' ref='upload' type='file' v-on:change='readFile'>
      <transition name='password-box'>
        <div class='password-wrapper' v-if='loadFile'>
          <form @submit.prevent='unlockWallet'>
            <input type='password' v-model='password' placeholder="Wallet password" ref='password' class='password-input' />
            <button type='submit' class='password-button'>Unlock</button>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>


<script lang='ts'>
import { HDNode } from "bitcoinjs-lib";
import { mapState } from "vuex";

import { decryptWallet } from "../util/crypto";
import { readText } from "../util/files";
export default {
  name: "LoadDashboard",
  data() {
    return {
      file: null,
      loadFile: false,
      encryptedFile: "",
      password: ""
    };
  },
  methods: {
    uploadFile: function() {
      this.$refs.upload.click();
    },
    readFile: async function(e) {
      this.loadFile = true;
      const file = e.target.files[0];
      const text = await readText(file);
      this.$refs.password.focus();
      this.encryptedFile = text;
    },
    unlockWallet: async function() {
      try {
        const node = await decryptWallet(this.encryptedFile, this.password);
        if (node instanceof HDNode) {
          this.$store.commit("setNode", node);
          this.$router.push("/dashboard");
        } else {
          throw new Error("Invalid password");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  },
  computed: mapState({
    // @ts-ignore
    node: state => state.node
  })
};
</script>

<style lang="scss" scoped>
.logo {
  width: 140px;
  height: auto;
  margin: 0 auto;
  display: block;
}
.upload {
  position: absolute;
  right: 1000vh;
}
$password-width: 500px;
.password-wrapper {
  width: 100%;
  max-width: $password-width;
  margin: 0 auto;
  transition: all 0.7s ease;
  overflow: hidden;
}
.password-button {
  width: 100%;
}
.password-input {
  margin-top: 2rem;
}
.password-box-enter,
.password-box-leave-to {
  max-height: 0;
  opacity: 0;
}
.password-box-leave,
.password-box-enter-to {
  max-height: 9rem;
  opacity: 1;
}
</style>
