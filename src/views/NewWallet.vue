<template>
  <div class="center-all">
    <div class="container">
      <div v-if="!$route.query.step">
        <h3 class='grey breadcrumb'>1/3</h3>
        <h1>Write down this recovery phrase.</h1>
        <h4 class="grey">This is a master key to your wallet. Anyone who has it can access your bitcoin, so keep it safe. You'll need it if you lose the file we're about to generate.</h4>
        <SeedDisplayContainer :mnemonic='mnemonic' :newSeed='newSeed' />
        <button class="fullwidth mt" @click="handleSeedSubmit">I wrote it down&nbsp;
          <i class="fas fa-check"></i>
        </button>
      </div>
      <div v-if="$route.query.step === 'password'">
        <h3 class='grey breadcrumb'>2/3</h3>
        <h1>Choose a very strong password.</h1>
        <h4 class="grey">We'll use this to encrypt the file that lets you access your wallet.</h4>
        <form autocomplete="new-password" @submit.prevent="handlePasswordSubmit">
          <div class='password-container'>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" ref="passwordInput" />
            <i class="password-icon far" :class="showPassword ?
            'fa-eye-slash' : 'fa-eye'" @click='showPassword = !showPassword'></i>
          </div>
          <div class="password-strength-meter">
            <div class="password-strength-bar" :style="{right: `-${Math.min(passwordStrength, 100)}%`}"></div>
          </div>
          <button class="fullwidth mt" :disabled="this.passwordStrength < 100">Generate wallet file&nbsp;
            <i class="fas fa-rocket"></i>
          </button>
        </form>
      </div>
      <div v-if="$route.query.step === 'work'">
        <h1>Generating wallet file
          <span v-for='i in workProgress' :key='i'>. </span>
          <span v-if='done'>done.</span>
        </h1>
        <transition name='download-box'>
          <div v-if='done' class='download-wrapper'>
            <h4 class='grey'>You'll need this file and your password every time you access your account.</h4>
            <div class='download'>
              <button class='mt' @click='downloadWallet'>Download your encrypted wallet&nbsp;
                <i class="far fa-arrow-alt-circle-down"></i>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { generateMnemonic } from "bip39";
import entropy from "string-entropy";

import { encryptWallet } from "../util/crypto";
import { textDownload } from "../util/files";

import SeedDisplayContainer from "../components/SeedDisplayContainer.vue";

export default {
  name: "NewWallet",
  components: {
    SeedDisplayContainer
  },
  data() {
    return {
      mnemonic: "",
      password: "",
      showPassword: true,
      workProgress: 0,
      done: false,
      encryptedWallet: null
    };
  },
  mounted() {
    this.newSeed();
  },
  methods: {
    newSeed: function() {
      this.mnemonic = generateMnemonic(128);
    },
    handleSeedSubmit: function() {
      this.$router.push({
        path: this.$route.path,
        query: {
          step: "password"
        }
      });
      setTimeout(() => this.$refs.passwordInput.focus(), 250);
    },
    handlePasswordSubmit: async function() {
      this.$router.push({
        path: this.$route.path,
        query: {
          step: "work"
        }
      });
      // start the ticker
      const intervalId = setInterval(() => this.workProgress++, 200);

      // encrypt seed with key
      const encrypted = await encryptWallet(
        this.password,
        "salt",
        this.mnemonic
      );
      clearInterval(intervalId);
      this.done = true;
      this.encryptedWallet = encrypted;
    },
    downloadWallet: function() {
      textDownload("wallet.odin", this.encryptedWallet);
      this.$store.commit("clearNode");
      this.$router.push("/dashboard");
    }
  },
  computed: {
    passwordStrength: function(): number {
      const target = 40;
      return entropy(this.password) / target * 100;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/_colors";
.breadcrumb {
  margin-bottom: -1.5rem;
}
.password-container {
  position: relative;
}
.password-icon {
  position: absolute;
  right: 0.5rem;
  top: 1.5rem;
  color: $grey;
  cursor: pointer;
  &:hover {
    color: $black;
  }
}
.password-strength-meter {
  width: 100%;
  height: 0.5rem;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  background: $black;
}
.password-strength-bar {
  position: absolute;
  background: white;
  height: 100%;
  width: 100%;
  right: 0;
  transition: right 0.2s ease;
}
.download-wrapper {
  transition: all 1.5s ease-in-out;
  overflow: hidden;
}
.download-box-enter {
  max-height: 0;
  opacity: 0;
}
.download-box-enter-to {
  max-height: 10rem;
  opacity: 1;
}
.download-box-leave,
.download-box-leave-active {
  transition: none;
}
</style>
