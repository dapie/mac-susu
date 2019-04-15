<template>
  <div id="wrapper">
    <img id="logo" src="https://www.susu.ru/sites/default/files/images/logo_46.png" alt="electron-vue">
    <div class="field">
      <div class="control">
        <input class="input" type="text" v-model="login" placeholder="Логин">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <input class="input" type="password" v-model="password" @keyup.enter="makeRequest()" placeholder="Пароль">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button @click="makeRequest()" class="button is-fullwidth is-outlined" :class="{ 'is-loading': loading }">Вход</button>
      </div>
    </div>
    <div class="field error">
      {{error}}
    </div>
  </div>
</template> 

<script>
export default {
  data () {
    return {
      login: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    makeRequest () {
      this.loading = true
      this.$electron.ipcRenderer.send('auth', this.login, this.password)
    }
  },
  created: function () {
    this.$electron.ipcRenderer.on('showError', (e, error) => {
      this.loading = false
      this.error = error
    })
  }
}
</script>

<style type="text/css">
  #wrapper {
    height: 100vh;
    width: 100vw;
  }

  #logo {
    display: block;
    padding: 90px 0 40px;
    margin: 0 auto;
    width: 150px;
    filter: brightness(0%) invert(100%);
  }

  .field{
    max-width: 300px;
    margin: 0 auto;
  }

  .error{
    text-align: center;
  }

  .button, .input{
    font-weight: 300;
    transition: all .2s ease-in;
  }

  .input:hover, .input:focus, .input:active{
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15) !important;
    transform: scale(1.02);
    transition: all .2s ease-in;
  }
</style>