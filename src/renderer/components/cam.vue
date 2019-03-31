<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <div class="container" v-if="isInitial">
        <form enctype="multipart/form-data" novalidate>
          <h1>Capture image</h1>
          <div class="dropbox">
            <WebCam
              ref="webcam"
              :device-id="deviceId"
              width="100%"
              @started="onStarted"
              @stopped="onStopped"
              @error="onError"
              @cameras="onCameras"
              @camera-change="onCameraChange"
            />
          </div>

          <v-btn @click="onCapture">Capture Photo</v-btn>
          <v-btn @click="onStop">Stop Camera</v-btn>
          <v-btn @click="onStart">Start Camera</v-btn>
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
import WebCam from "@/components/WebCam.vue";
import { find, head } from "lodash";
import Tesseract from "tesseract.js";

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;

export default {
  name: "CAM",
  resource: "CAM",
  components: {
    WebCam
  },
  data() {
    return {
      currentStatus: null,
      status: {},
      drawer: null,

      img: null,
      camera: null,
      deviceId: null,
      devices: []
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
  watch: {
    camera: function(id) {
      this.deviceId = id;
    },
    devices: function() {
      // Once we have a list select the first one
      let first = head(this.devices);
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    }
  },
  methods: {
    resetClick: function() {
      this.currentStatus = null;
      this.status = {};
      this.drawer = null;
      this.reset();
    },
    ocr: function(file) {
      console.log(file);

      Tesseract.recognize(file)
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
    onCapture() {
      const file = this.$refs.webcam.save();
      console.log(file);
      this.currentStatus = STATUS_SAVING;
      this.ocr(file);
    },
    onStarted(stream) {
      console.log("On Started Event", stream);
    },
    onStopped(stream) {
      console.log("On Stopped Event", stream);
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.$refs.webcam.start();
    },
    onError(error) {
      console.log("On Error Event", error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      console.log("On Camera Change Event", deviceId);
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
