<template>
  <div class="card">
    <div class="card-header">{{ sender }}</div>
    <div class="card-body">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "MessageItem",
  props: {
    sender: {
      type: String
    },
    message: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>