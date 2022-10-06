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
      console.log('registration', data)
      this.username = data.username;
      this.chats = data.chats;
      this.graph = data.graph;
      this.loginSuccess = true;
    });

    socketioService.socket.on('new node', (node) => {
      console.log('new node')
      console.log('before pushing node ', node)
      this.graph.nodes.push(node);                        // method for pushing node to graph
      console.log('after pushing node ', node)
    });

    socketioService.socket.on('login', (data) => {
      console.log('login', data)
      this.loginSuccess = true;
      this.username = data.username;
      this.chats = data.chats;
      this.graph = data.graph;
    });

    socketioService.socket.on('node active', (node) => {
      // TODO method for changing the node property
      console.log('node active')
      console.log(node)
      console.log('before changing', this.graph.nodes)
      for (let n of this.graph.nodes) {
        if (n.username === node.username) {
          n.is_active = true
          break
        }
      }
      console.log('after changing', this.graph.nodes)
    });

    socketioService.socket.on('login failed', (msg) => {
      this.loginSuccess = false;
      this.errorMessage = msg;
    });

    socketioService.socket.on('add contact', (chats) => {
      console.log('add contact')
      this.chats = chats;                                   // maybe change for receiving only new chat and not all list
    });

    socketioService.socket.on('new links', (links) => {
      console.log('new links')
      console.log('before pushing link ', links)
      this.graph.links.push(links[0])                              // method for pushing links into graph
      this.graph.links.push(links[1])                              // method for pushing links into graph
      console.log('after pushing link ', links)
    });

    socketioService.socket.on('contact does not exist', (msg) => {
      alert(msg);  // TODO make better alert
    });

    // 'message' event is in ChatArea. Maybe put it here ?

    socketioService.socket.on('node inactive', (node) => {
      console.log('node inactive', node)
      console.log('before changing', this.graph.nodes)
      for (let n of this.graph.nodes) {
        if (n.username === node.username) {
          n.is_active = false
          break
        }
      }
      console.log('after changing', this.graph.nodes)
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
