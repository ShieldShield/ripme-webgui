<template>
  <div class="ani-slideInDown text-center">
    <form @submit="onPathChanged">
      <h2>Download Directory</h2>
      <br />
      <input type="text" placeholder="Absolute Path" v-model="text" required />
    </form>
    <br />
    <div class="switches">
      <table style="text-align:left; margin-left: auto; margin-right: auto;">
        <tr>
          <td>Keep saveorder</td>
          <td>
            <toggle-button
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeEventHandler"
            />
          </td>
        </tr>
        <tr>
          <td>Skip 404 errors</td>
          <td>
            <toggle-button
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeEventHandler"
            />
          </td>
        </tr>
        <tr>
          <td>create prop file</td>
          <td>
            <toggle-button
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeEventHandler"
            />
          </td>
        </tr>
        <tr>
          <td>Rerip</td>
          <td>
            <toggle-button
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeEventHandler"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<<script>
export default {
  
}
</script>
