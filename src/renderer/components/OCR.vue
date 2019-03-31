<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <div class="container" v-if="isInitial">
        <form enctype="multipart/form-data" novalidate>
          <h1>Upload image</h1>
          <div class="dropbox">
            <input
              type="file"
              :name="'document'"
              :disabled="isSaving"
              @change="filesChange($event.target.files);"
              accept="image/*"
              class="input-file"
            >
            <p v-if="isInitial">
              Drag and Drop
              <br>or click to browse
            </p>
          </div>
        </form>
      </div>
      <div class="container text-xs-center" v-if="isSaving">
        <v-progress-circular
          v-bind:size="200"
          v-bind:width="15"
          v-bind:rotate="-90"
          v-bind:value="(status.progress * 100)"
          color="primary"
        >{{progress}} %</v-progress-circular>
        <h2>{{status.status}}</h2>
      </div>
      <v-layout row wrap v-if="isSuccess || isFailed">
        <v-flex xs12>
          <v-divider></v-divider>
          <v-btn v-on:click="resetClick()">Reset</v-btn>
          <v-text-field
            label="Result"
            v-model="status.text"
            counter
            full-width
            multi-line
            single-line
            :auto-grow="true"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import Tesseract from "tesseract.js";

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;

export default {
  name: "OCR",
  resource: "OCR",
  data() {
    return {
      currentStatus: null,
      status: {},
      drawer: null
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
    progress() {
      return Math.floor(this.status.progress * 100);
    }
  },
  methods: {
    resetClick: function() {
      this.currentStatus = null;
      this.status = {};
      this.drawer = null;
      this.reset();
    },
    ocr: function(event) {
      console.log(event.path);

      Tesseract.recognize(event.path)
        .progress(status => {
          this.status = status;
        })
        .then(result => {
          this.currentStatus = STATUS_SUCCESS;
          this.status = result;
        })
        .catch(error => {
          this.currentStatus = STATUS_FAILED;
          this.status = error;
        });
    },
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.status = {};
    },
    save() {},
    drive() {},
    filesChange(fileList) {
      if (!fileList.length) return;
      this.currentStatus = STATUS_SAVING;
      this.ocr(fileList[0]);
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style>
.dropbox {
  outline: solid rgb(0, 0, 0); /* the dash box */
  outline-offset: -10px;
  background: transparent;
  color: rgb(0, 0, 0);
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: rgba(
    117,
    117,
    117,
    0.26
  ); /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
