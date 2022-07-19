<template>
  <v-form>
    <v-row>
      <v-col
        cols="12"
        md="3"
      >
        <label for="firstnameHorizontalIcons">Task</label>
      </v-col>

      <v-col
        cols="12"
        md="9"
      >
        <v-text-field
          id="firstnameHorizontalIcons"
          v-model="todo.task"
          hide-details="auto"
          :prepend-inner-icon="icons.mdiAccountOutline"
          outlined
          dense
          :error-messages="errors.task"
          placeholder="Task"
        ></v-text-field>
      </v-col>

      <v-col
        v-if="todo.id"
        cols="12"
        md="3"
      >
        <label
          v-if="todo.id"
          for="mobileHorizontalIcons">Status</label>
      </v-col>
      <v-col
        v-if="todo.id"
        cols="12"
        md="9"
      >
        <v-select
          v-if="todo.id"
          v-model="todo.status"
          outlined
          dense
          hide-details="auto"
          :prepend-inner-icon="icons.mdiHumanEdit"
          :error-messages="errors.status"
          placeholder="Status"
          :items="statusOptions"
        ></v-select>
      </v-col>
      <v-col
        offset-md="3"
        cols="12"
      >
        <v-btn
          color="primary"
          @click="submit"
        >
          Submit
        </v-btn>
        <v-btn
          type="reset"
          outlined
          class="mx-2"
          @click="cancel"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import {
  watch,
  onMounted,
  ref,
  toRef, computed,
} from '@vue/composition-api/dist/vue-composition-api'
import {
  mdiAccountOutline,
  mdiCellphone,
  mdiEmailOutline,
  mdiLockOutline,
} from '@mdi/js'
import UserAccessManagementService from '@/service/UserAccessManagementService'
import store from '@/store'

export default {
  props: {
    todoData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    const errors = computed(() => store.state.UserAccessManagementStore.errors)
    const service = new UserAccessManagementService()
    const todo = toRef(props, 'todoData')
    const statusOptions = ref([
      'Todo',
      'Done',
      'Cancelled',
    ])

    onMounted(async () => {
      await service.getTodos(true)
    })

    const cancel = () => {
      emit('clicked', false)
    }

    const submit = () => {
      if (todo.value.id === undefined) {
        const formData = {
          task: todo.value.task,
          status: 'todo',
        }

        store.dispatch('UserAccessManagementStore/createTodo', formData).then(
          response => {
            if (response.id !== undefined) {
              emit('clicked', {
                alertType: 'success',
                alertMessage: 'Successfully Added A Todo.',
              })
            }
          },
        )
      } else {
        store.dispatch('UserAccessManagementStore/updateTodo', {
          id: todo.value.id,
          task: todo.value.task,
          status: todo.value.status.charAt(0).toLowerCase() + todo.value.status.slice(1),
        }).then(
          () => {
            store.dispatch('UserAccessManagementStore/getTodos')
            emit('clicked', false)
          },
        )
      }
    }

    return {
      cancel,
      errors,
      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiCellphone,
        mdiLockOutline,
      },
      todo,
      submit,
      statusOptions,
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style scoped>

</style>
