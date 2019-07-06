<template>
  <div class="ani-slideInDown text-center">
    <form @submit="onPathChanged">
      <h2>Download Directory</h2>
      <br>
      <input type="text" placeholder="Absolute Path" v-model="text" required />
    </form>
    <br>
    <toggle-button :value="true"
               :labels="{checked: 'on', unchecked: 'off'}" @change="onChangeEventHandler"/>
  </div>
</template>

<<script>
export default {
  
}
</script>
