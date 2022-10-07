<template>
  <div>
    <form @submit.prevent class="input-group my-3">

      <input
          type="text"
          placeholder="Add chat"
          v-model.lazy="addUser"
          class="form-control">

      <button type="submit" @click="addChat" class="btn btn-outline-primary">Add</button>

    </form>
  </div>

  <div>
    <div v-for="name in chats" :key="name" class="list-group">
      <chat-item
          :name="name"
          @changechat="changeChat">
      </chat-item>
    </div>
  </div>
</template>

<script>
import socketioService from "../../services/socketio.service";
import ChatItem from "@/components/ChatItem";
export default {
  name: "ChatList",
  components: {ChatItem},
  data() {
    return {
      currentChat: '',
      addUser: '',
    }
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    chats: {
      type: Array,
    }
  },
  methods: {
    addChat() {
      socketioService.addChat(this.username, this.addUser)
    },
    changeChat(data) {
      this.currentChat = data;
      this.$emit('changechat', data)
    }
  },
}
</script>

<style scoped>

</style>