<template>
  <div class="chat-area">
    <div v-for="msg in messages" :key="msg">
      <p v-if="msg.sender === this.destination || (msg.sender === 'You' && msg.destination === this.destination)">
        <span class="badge bg-primary">{{ msg.sender }}:</span> {{msg.message}}
      </p>
    </div>
    <div>
      <form @submit.prevent class="input-group mb-3">
        <input type="text" placeholder="Message" v-model="message" class="form-control">
        <button type="submit" @click="sendMsg" class="btn btn-outline-primary">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import socketioService from "../../services/socketio.service";


export default {
  name: "ChatArea",
  created() {
    socketioService.socket.on('message', (message) => {
      this.messages.push(message);
      const channel = document.getElementById(`${this.destination}-${this.username}`)
      console.log(channel)
      channel.style.stroke = 'red'
      channel.style.strokeWidth = '5px'
      setTimeout(function () {
        channel.style.stroke = 'black'
        channel.style.strokeWidth = '2px'
      }, 500)
    })
  },
  data() {
    return{
      message: '',
      messages: [],
    }
  },
  props: {
    destination: {
      type: String
    },
    username: {
      type: String
    }
  },
  methods: {
    sendMsg() {
      socketioService.sendMsg(this.message, this.username, this.destination);
      this.messages.push({'message': this.message, 'sender': 'You', 'destination': this.destination});
      this.message = '';
      const channel = document.getElementById(`${this.username}-${this.destination}`)
      console.log(channel)
      channel.style.stroke = 'red'
      setTimeout(function () {
        channel.style.stroke = 'black'
      }, 500)

    },
  },
}
</script>

<style scoped>

</style>