<template>
  <div class='seed-container' :key='$route.fullPath'>
    <i class="far fa-clipboard copy" @click='copySeed'></i>
    <i class="fas fa-sync-alt refresh" @click='newSeed'></i>
    <transition name='copied'>
      <span class='copied' v-if='copying'>Copied!</span>
    </transition>
    <div class='seed-item' v-for='(word, idx) in seedWords' :key='`${word}-${idx}`'>
      {{ word }}
    </div>
    <textarea class='gtfo' v-model='mnemonic' ref='seed' />
  </div>
</template>

<script lang='ts'>
export default {
  name: "SeedDisplayContainer",
  props: {
    mnemonic: String,
    newSeed: Function
  },
  data() {
    return {
      copying: false
    };
  },
  methods: {
    copySeed: function() {
      this.copying = true;
      this.$refs.seed.select();
      document.execCommand("copy");
      this.$refs.seed.blur();
      setTimeout(() => (this.copying = false), 1000);
    }
  },
  computed: {
    seedWords: function() {
      return this.mnemonic.split(" ");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/_colors";
.seed-container {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1.5rem;
  padding-right: 1rem;
  border: 1px solid $black;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  position: relative;
}
.copy,
.refresh {
  position: absolute;
  color: $grey;
  font-size: 1.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    color: $black;
  }
}
.copy {
  right: 0.65rem;
  top: 0.5rem;
}
.refresh {
  right: 0.5rem;
  top: 3rem;
}
.seed-item {
  font-weight: 500;
  text-align: left;
  flex-basis: 16.6%;
  box-sizing: border-box;
  padding: 0.5rem;
  @media (max-width: 600px) {
    flex-basis: 33.3%;
  }
}
.copied {
  position: absolute;
  padding: 0.1rem;
  right: 2.5rem;
  top: 0.5rem;
  border-radius: 2px;
  background: #eee;
}

.gtfo {
  position: absolute;
  right: 1000vw;
}
</style>
