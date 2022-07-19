<template>
  <div>
    <v-alert
      dismissible
      :type="typeData"
      :value="show"
    >
      {{ messageData }}
    </v-alert>
  </div>
</template>

<script>
import { ref, toRef, watch } from '@vue/composition-api'

export default {
  name: 'AlertDialog',
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props, { emit }) {
    const alert = toRef(props, 'show')
    const messageData = toRef(props, 'message')
    const typeData = toRef(props, 'type')
    const show = ref(false)

    watch(alert, () => {
      if (alert.value === true) {
        show.value = true
        setTimeout(() => { show.value = false }, 3000)
      }
    })

    return {
      messageData,
      show,
      typeData,
    }
  },
}
</script>

<style scoped>

</style>
