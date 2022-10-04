<template>
  <div id="app">
    <LoginUser v-if="!loginSuccess"
               :login-success="loginSuccess"
               :error-message="errorMessage"></LoginUser>

    <MainChat v-else
              :username="username"
              :chats="chats"
              :graph="graph"></MainChat>
  </div>
</template>

<script>
import SocketioService from "../services/socketio.service";
import LoginUser from "@/components/LoginUser";
import MainChat from "@/components/MainChat";
import socketioService from "../services/socketio.service";

export default {
  name: 'App',
  components: {MainChat, LoginUser},
  data() {
    return {
      loginSuccess: false,
      errorMessage: '',
      username: '',
      chats: [],
      graph: {},
    }
  },
  methods: {
    startChat(data) {
      this.username = data.username;
      console.log(this.username)
      this.loginSuccess = true;
      this.chats = data.chats;
      this.graph = data.graph;
    },
    // updateGraph(data) {
    //   this.graph = data.graph;
    //   console.log('in App')
    //   console.log(data.graph)
    // }
  },
  created() {
    SocketioService.setupSocketConnection();

    socketioService.socket.on('login failed', (data) => {
        this.errorMessage = data;
      });
    socketioService.socket.on('login success', (data) => {
      this.loginSuccess = true;
      this.username = data.username;
      this.chats = data.chats;
      this.graph = data.graph;
      console.log(this.username + ' from login')
      // this.$emit('login', {username: data.username, chats: data.chats, graph: data.graph});
    });

    socketioService.socket.on('new connection added', (data) => {
      console.log('connection added')
      // this.graph = data.graph;
      if (this.username === data.username) {
        this.chats = data.chats;
      }
    });
    socketioService.socket.on('logout', (data) => {
      this.graph = data.graph;
    });
    socketioService.socket.on('graph', data => {
      this.graph = data.graph;
      console.log('graph from: ' + data.from)
    })
  },
  mounted() {
    // socketioService.socket.on('new connection added', (data) => {
    //   console.log('connection added')
    //   this.graph = data.graph;
    //   if (this.username === data.username) {
    //     this.chats = data.chats;
    //   }
    // });
    // socketioService.socket.on('logout', (data) => {
    //   this.graph = data.graph;
    // });
    // socketioService.socket.on('graph', data => {
    //   this.graph = data.graph;
    //   console.log('graph get from login')
    // })
  },
  beforeUnmount() {
    SocketioService.disconnect(this.username);
  }
}
</script>

<style>
#app {

}
</style>
