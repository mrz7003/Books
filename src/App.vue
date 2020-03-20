<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created () {
      this.$axios.defaults.withCredentials = true
      this.$axios.get('http://localhost:8089/Users/Verify').then((resp) => {
        if (resp.data === 'success') {
          this.$router.push('/Index')
        } else {
          this.$router.push('/Login')
        }
      })
    }
  }
</script>

<style>
  body {
    padding: 0;
    margin: 0;
  }
</style>
