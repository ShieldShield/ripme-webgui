<template>
  <div class="ani-slideInDown text-center">
    <h2>Download Directory</h2>
    <br />
    <input
      type="text"
      placeholder="Absolute Path"
      v-model="path"
      v-on:keyup.enter="onPathChanged()"
    />
    <br />
    <div class="switches">
      <table style="text-align:left; margin-left: auto; margin-right: auto;">
        <tr>
          <th>
            <h3>General</h3>
          </th>
        </tr>
        <tr>
          <td>Keep saveorder</td>
          <td>
            <toggle-button
              :value="this.saveorder"
              :sync="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeSaveOrder"
            />
          </td>
        </tr>
        <tr>
          <td>Skip 404 errors</td>
          <td>
            <toggle-button
              :value="this.skip"
              :sync="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeSkip"
            />
          </td>
        </tr>
        <tr>
          <td>create prop file</td>
          <td>
            <toggle-button
              :value="this.prop"
              :sync="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeProp"
            />
          </td>
        </tr>
        <tr>
          <td>Rerip</td>
          <td>
            <toggle-button
              :value="this.rerip"
              :sync="true"
              :labels="{checked: 'on', unchecked: 'off'}"
              @change="onChangeRerip"
            />
          </td>
        </tr>
        <tr>
          <th>
            <h3>Automation</h3>
          </th>
        </tr>
        <tr>
          <td>Set interval mode (Daily/Weekly)</td>
          <td>
            <toggle-button
              :value="this.weekly"
              :sync="true"
              :labels="{checked: 'Weekly', unchecked: 'Daily'}"
              @change="onChangeWeekly"
            />
          </td>
        </tr>
        <tr v-if="weekly===true">
          <td>Weekday</td>
          <td>
            <form>
              <fieldset>
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Monday"
                /> Monday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Tuesday"
                /> Tuesday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Wednesday"
                /> Wednesday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Thursday"
                /> Thursday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Friday"
                /> Friday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Saturday"
                /> Saturday
                <br />
                <input
                  type="radio"
                  v-model="weekday"
                  v-on:click="onRadioClicked"
                  name="Weekday"
                  value="Sunday"
                /> Sunday
                <br />
              </fieldset>
            </form>
            <strong style="color:green">{{weekday}}</strong>
          </td>
        </tr>
        <tr>
          <td>Time</td>
          <td>
            <a-TimePicker format="HH:mm" minuteStep="30" v-model="time" @change="onChangeTime" />
          </td>
        </tr>
        <tr>
          <th>
            <h3>Other</h3>
          </th>
        </tr>
        <tr>
          <td>Push settings to server (fix desync)</td>
          <td>
            <div class="btn" v-on:click="pushSettings">push</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8081";
import axios from "axios";
import snotify from "vue-snotify";
import VueTimepicker from "vue2-timepicker";
export default {
  data() {
    return {
      //Boolean types
      saveorder: JSON.parse(localStorage.getItem("saveorder")),
      prop: JSON.parse(localStorage.getItem("prop")),
      skip: JSON.parse(localStorage.getItem("skip")),
      rerip: JSON.parse(localStorage.getItem("rerip")),
      weekly: JSON.parse(localStorage.getItem("weekly")),
      weekday: JSON.parse(localStorage.getItem("weekday")),
      time: []
    };
  },
  methods: {
    onChangeTime() {
      this.$snotify.info(`Time for Automation: ${this.time}`);
      console.log(`Time: ${this.time}`);
    },

    onPathChanged() {
      console.log("user input: " + this.path);
      let path = this.path;
      let regex = `(\\\\?([^\\/]*[\\/])*)([^\\/]+)$`;
      if (path.match(regex)) {
        this.$snotify.info("Path Changed");
        if (path.length <= 6) {
          this.$snotify.warning("Something seems off, please doublecheck", {
            timeout: 6000
          });
        }
        console.log("test: " + encodeURIComponent(path));
        axios.get(`${baseURL}/api/command/add/l/${encodeURIComponent(path)}`);
      } else {
        this.$snotify.error("Isn't a valid path");
      }
    },

    onChangeSaveOrder() {
      this.saveorder = !this.saveorder;
      this.$snotify.info(`set saveorder to ${this.saveorder}`);
      console.log(`JSON ${this.saveorder}`);
      localStorage.setItem("saveorder", JSON.stringify(this.saveorder));
      if (this.saveorder) {
        axios.get(`${baseURL}/api/command/add/d`);
        axios.get(`${baseURL}/api/command/rem/D`);
      } else {
        this.$snotify.warning(
          `This could result in unmanagable datastructures, use only if you know what you are doing`,
          {
            timeout: 8000
          }
        );
        axios.get(`${baseURL}/api/command/rem/d`);
        axios.get(`${baseURL}/api/command/add/D`);
      }
    },
    onChangeSkip() {
      console.log("rerip");
      this.skip = !this.skip;
      this.$snotify.info(`set Skip 404 to ${this.skip}`);
      localStorage.setItem("skip", JSON.stringify(this.skip));
      if (this.skip) {
        axios.get(`${baseURL}/api/command/add/4`);
      } else {
        axios.get(`${baseURL}/api/command/rem/4`);
      }
    },
    onChangeProp() {
      this.prop = !this.prop;
      this.$snotify.info(`set prop file to ${this.prop}`);
      localStorage.setItem("prop", JSON.stringify(this.prop));
      if (this.prop) {
        axios.get(`${baseURL}/api/command/rem/n`);
      } else {
        axios.get(`${baseURL}/api/command/add/n`);
        this.$snotify.warning(
          `This is only usefull if you plan to delete the data later otherwise it could lead to potential overuse of bandwith and datacorruption`,
          {
            timeout: 10000
          }
        );
      }
    },
    onChangeRerip() {
      this.rerip = !this.rerip;
      this.$snotify.info(`set rerip to ${this.rerip}`);
      localStorage.setItem("rerip", JSON.stringify(this.rerip));
      if (this.rerip) {
        axios.get(`${baseURL}/api/command/add/r`);
        this.$snotify.warning(
          `This will overwrite existing copies of file, this could lead to data corruption`,
          {
            timeout: 8000
          }
        );
      } else {
        axios.get(`${baseURL}/api/command/rem/r`);
      }
    },
    onChangeWeekly() {
      this.weekly = !this.weekly;
      localStorage.setItem("weekly", this.weekly);
      let response;
      if (this.weekly) {
        response = "Weekly";
      } else {
        response = "Daily";
      }
      this.$snotify.info(`set update interval to ${response}`);
    },

    onRadioClicked() {
      setTimeout(() => {
        localStorage.setItem("weekday", JSON.stringify(this.weekday));
        this.$snotify.info(`Set Weekday to ${this.weekday}`);
      }, 10);
    },

    updateTimings() {
      if (this.weekly === "Weekly") {
        //TODO: change timings
      } else {
        //TODO: DAILY change timings
      }
    },

    resetSettings() {
      this.saveorder = true;
      this.prop = true;
      this.skip = true;
      this.rerip = false;
      this.$snotify.info(`Settings are now reset`);
    },
    pushSettings() {
      this.$snotify.warning(
        `Because of changes, multiple messages will appear if push is pressed, please ignore them`,
        {
          timeout: 9000
        }
      );
      this.$snotify.confirm(
        `this will push your settings to the Server, continue?`,
        {
          timeout: 20000,
          buttons: [
            { text: "push", action: () => this.pushHelper() },
            { text: "cancel" },
            { text: "close" }
          ]
        }
      );
    },
    pushHelper() {
      for (let i = 0; i < 2; i++) {
        this.onChangeRerip();
        this.onChangeProp();
        this.onChangeSkip();
        this.onChangeSaveOrder();
        this.$snotify.void;
      }
    }
  }
};
</script>
