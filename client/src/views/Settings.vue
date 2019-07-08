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
            <toggle-button v-model="saveorder"
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeSaveOrder"
            />
          </td>
        </tr>
        <tr>
          <td>Skip 404 errors</td>
          <td>
            <toggle-button v-model="skip"
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeSkip"
            />
          </td>
        </tr>
        <tr>
          <td>create prop file</td>
          <td>
            <toggle-button v-model="prop"
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeProp"
            />
          </td>
        </tr>
        <tr>
          <td>Rerip</td>
          <td>
            <toggle-button v-model="rerip"
              :value="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeRerip"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<<script>
const baseURL = "http://localhost:8081";
import axios from "axios";
import snotify from "vue-snotify";
export default {
  methods: {
    onChangeSaveOrder() {
      this.$snotify.info(`set saveorder to ${this.saveorder}`);
      if(this.saveorder) {
        axios.get(`${baseURL}/api/command/add/d`);
        axios.get(`${baseURL}/api/command/rem/D`);
      } else {
        this.$snotify.warning(`This could result in unmanagable datastructures, use only if you know what you are doing`, {
          timeout:8000
        });
        axios.get(`${baseURL}/api/command/rem/d`);
        axios.get(`${baseURL}/api/command/add/D`);
      }
    },
    onChangeSkip() {
      this.$snotify.info(`set Skip 404 to ${this.skip}`);
      if(this.skip) {
        axios.get(`${baseURL}/api/command/add/4`);
      } else {
        axios.get(`${baseURL}/api/command/rem/4`);
      }
    },
    onChangeProp() {
      this.$snotify.info(`set prop file to ${this.prop}`);
      if(this.prop) {
        axios.get(`${baseURL}/api/command/add/n`);
      } else {
        axios.get(`${baseURL}/api/command/rem/n`);
        this.$snotify.warning(`This is only usefull if you plan to delete the data later otherwise it could lead to potential overuse of bandwith and datacorruption`, {
          timeout:10000
        });
      }
    },
    onChangeRerip() {
      this.$snotify.info(`set rerip to ${this.rerip}`);
      if(this.rerip) {
        axios.get(`${baseURL}/api/command/add/r`);
        this.$snotify.warning(`This will overwrite existing copies of file, this could lead to data corruption`, {
          timeout:8000
        });
      } else {
        axios.get(`${baseURL}/api/command/rem/r`);
      }
    }
  },
}
</script>
