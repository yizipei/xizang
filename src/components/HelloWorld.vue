<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  msg: string
}>()

let num = ref(0)

const numAdd = function() {
  num.value++
  console.log(num);
}

let test = '123qqqq'
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}
      <span @click="numAdd" class="sapn1">{{ num }} {{ test }}</span>
    </h1>
    <van-button type="primary">12j33l123</van-button>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      What's next?
    </h3>
  </div>
</template>

<style scoped lang="less">
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;

  .sapn1 {
    font-size: 100px;
  }
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
