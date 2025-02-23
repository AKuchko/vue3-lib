<template>
  <main>
    <h1>App is working</h1>
    <ak-button label="Some label 2">
    </ak-button>

    <ak-float-label label="Fuck off">
      <ak-input invalid />
    </ak-float-label>
  </main>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
