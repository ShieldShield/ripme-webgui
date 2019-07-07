<template>
  <div class="ani-slideInDown text-center">
    <form @submit="onPathChanged">
      <h2>Downloading Once</h2>
      <br>
      <input type="text" placeholder="URL" v-model="text" required />
    </form>
    <br>
  </div>
</template>

<<script>
export default {
  
}
</script>
