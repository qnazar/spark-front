<template>
  <div id="app">

    <LoginUser v-if="!loginSuccess"
               :login-success="loginSuccess"
               :error-message="errorMessage">
    </LoginUser>

    <MainChat v-else
              :username="username"
              :chats="chats"
              :graph="graph">
    </MainChat>

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

  },
  created() {
    SocketioService.setupSocketConnection();

    socketioService.socket.on('registration', (data) => {
      this.username = data.username;
      this.chats = data.chats;
      this.graph = data.graph;
      this.loginSuccess = true;
    });

    socketioService.socket.on('new node', (node) => {
      this.graph.nodes.push(node);
    });

    socketioService.socket.on('login', (data) => {
      this.loginSuccess = true;
      this.username = data.username;
      this.chats = data.chats;
      this.graph = data.graph;
    });

    socketioService.socket.on('node active', (node) => {
      for (let n of this.graph.nodes) {
        if (n.username === node.username) {
          n.is_active = true;
          break
        }
      }
    });

    socketioService.socket.on('login failed', (msg) => {
      this.loginSuccess = false;
      this.errorMessage = msg;
    });

    socketioService.socket.on('add contact', (chats) => {
      this.chats = chats;
    });

    socketioService.socket.on('new links', (links) => {
      this.graph.links.push(links[0]);
      this.graph.links.push(links[1]);
    });

    socketioService.socket.on('contact does not exist', (msg) => {
      alert(msg);
    });

    // 'message' event is in ChatArea.

    socketioService.socket.on('node inactive', (node) => {
      for (let n of this.graph.nodes) {
        if (n.username === node.username) {
          n.is_active = false;
          break
        }
      }
    });
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
