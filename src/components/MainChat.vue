<template>
  <div class="row">
    <div class="col-2 p-3">
      <h2 class="text-center"><span class="badge bg-primary">{{ username }}</span></h2>
      <chat-list :username="username" :chats="chats" @changechat="openChat"></chat-list>
    </div>
    <div class="col-4 p-3" @chat-selected="openChat">
      <h5><span class="badge bg-primary">Chat with {{currentChat}}</span></h5>
      <chat-area :destination="currentChat" :username="username"></chat-area>
    </div>
    <div class="col-6 p-3" style="overflow: hidden">
      <graph-visual :graph="graph" :username="username"></graph-visual>
    </div>
  </div>

</template>

<script>
import ChatList from "@/components/ChatList";
import ChatArea from "@/components/ChatArea";
import GraphVisual from "@/components/GraphVisual";
export default {
  name: "MainChat",
  components: {GraphVisual, ChatArea, ChatList},
  data() {
    return {
      currentChat: '',
    }
  },
  props: {
    username: {
      type: String,
      required: true,
    },
    chats: {
      type: Array,
    },
    graph: {
      type: Object,
    }
  },
  methods: {
    openChat(data) {
      this.currentChat = data
      console.log('chat selected in MainChat');
    },
  }
}
</script>

<style scoped>

</style>