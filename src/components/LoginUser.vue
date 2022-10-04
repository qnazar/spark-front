<template>
  <div class="container my-5">
    <h1 style="text-align: center">Welcome to SparkChat</h1>
    <h6 style="text-align: center">Please, login to start chatting</h6>
    <form @submit.prevent="loginUser">
      <input type="text" v-model.lazy="username" placeholder="Username" class="form-control">
      <input type="password" v-model.lazy="password" placeholder="Password" class="form-control">
      <button @click="loginUser" type="submit" class="btn btn-primary w-100">Join</button>
    </form>
    <div v-if="!loginSuccess" class="alert alert-primary">{{ errorMessage }}</div>
  </div>

</template>

<script>
import socketioService from "../../services/socketio.service";

export default {
  name: "LoginUser",
  data() {
    return {
      username: '',
      password: '',
      // loginSuccess: true,
      // errorMessage: '',
    }
  },
  props: {loginSuccess: {type: Boolean}, errorMessage: {type: String}},
  methods: {
    loginUser() {
      socketioService.loginUser(this.username, this.password);
      // socketioService.socket.on('login failed', (data) => {
      //   this.errorMessage = data;
      //   this.loginSuccess = false;
      // });
      // socketioService.socket.on('login success', (data) => {
      //   this.loginSuccess = true;
      //   this.$emit('login', {username: data.username, chats: data.chats, graph: data.graph});
      // });
    },
  }
}
</script>

<style scoped>
input, button {
  margin: 10px;
}

</style>