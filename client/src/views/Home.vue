<template>
  <div class="ani-slideInDown row justify-content-center">
    <div class="col-lg-6">
      <ToDoInput @eventAddNewTask="onAddNewTask"/>

      <ul class="list mt-3">
        <ListItem
          v-for="item in itemList"
          :key="item.id"
          :text="item.text"
          :id="item.id"
          :isDone="item.isDone"
          @eventTaskStatusChange="onTaskStatusChange"
          @eventTaskDelete="onTaskDelete"
        />
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ToDoInput from "@/components/ToDoInput.vue";
import ListItem from "@/components/ListItem.vue";
import axios from "axios";
import snotify from 'vue-snotify';

const baseURL="http://localhost:8081";
export default {
  name: "home",
  components: {
    ToDoInput,
    ListItem
  },
  data() {
    return {
      itemList: []
    };
  },
  methods: {
    /**
     * Event: add new task
     */

    displayNotification() {
      this.$snotify.success({
        body: 'Success Body',
        title: 'Success Title',
        config: {}
      });
    },

    onAddNewTask(taskName) {
      if(!is_url(taskName)) {
        this.$snotify.error(taskName+" isn't a valid URL");
        return;
      }
      const task = {
        id: new Date().getTime(),
        text: taskName,
        isDone: false
      };
      if (!contains(this.itemList, "text", taskName)) {
        this.itemList.push(task);
        this.$snotify.success(taskName+" will now be synced")
        let url=encodeURIComponent(taskName);
        console.log(url)
        axios.get(`${baseURL}/api/shell/add/${url}`)
      } else {
        this.$snotify.info(taskName+" is already synced, will not be added");
      }
    },

    /**
     * Event: on task status changed
     */
    onTaskStatusChange(id, checked) {
      console.log(id, checked);

      let item = this.itemList.find(i => i.id == id);
      if (item) {
        item.isDone = checked;
      }

      console.log(this.itemList);
    },

    /**
     * Event: on task deleted
     */
    onTaskDelete(id) {
      console.log("id: "+id);

      let index = this.itemList.findIndex(i => i.id == id);
      let url = this.itemList[index].text;
      if (index > -1) {
        console.log(this.itemList.splice(index, 1));
      }
      this.$snotify.success(`${url} removed`)
      console.log(this.itemList);
    },

    /**
     * Load item list from local storage
     */
    loadItemList() {
      this.itemList = JSON.parse(localStorage.getItem("VuejsTodo")) || [];

      console.log("this.itemList =", this.itemList);
    },

    /**
     * Update the item list to local storage
     */
    updateItemList() {
      localStorage.setItem("VuejsTodo", JSON.stringify(this.itemList));
    }
  },
  mounted() {
    // Load item list from local storage
    this.loadItemList();
  },
  watch: {
    itemList: {
      handler(value) {
        console.log("item changed");

        // save to localStorage
        this.updateItemList();
      },
      deep: true
    }
  }
};

function contains(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) return true;
  }
  return false;
}

function is_url(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

function apiCall(mode, url) {
  
}
</script>