<template>
  <div class="list-group-item" @click="selectChat">
    <h5>{{ name }}</h5>
  </div>
</template>

<script>
export default {
  name: "ChatItem",
  props: {
    name: {
      type: String
    },
  },
  methods: {
    selectChat() {
      this.$emit('changechat', this.name)
      console.log('selected in chatItem')
    }
  }
}
</script>

<style scoped>
.list-group-item {
  border: 1px solid lightblue;
  margin-top: 1px;
}
</style>