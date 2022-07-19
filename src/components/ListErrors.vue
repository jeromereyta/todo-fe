<template v-show="errors">
  <div>
    <div v-for="(value, key) in errors" :key="key">
      <v-alert
        shaped
        dense
        dark
        type="error"
      >
        <v-row align="center">
          <v-col class="grow">
            <span v-for="err in value" :key="err" v-text="err"/>
          </v-col>
        </v-row>
      </v-alert>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Object,
      required: true,
    },
  },
};
</script>
