<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="todos"
      :search="search"
      sort-by="title"
      class="elevation-1"
      fixed-header
      :loading="loading"
    >
      <!-- status -->
      <template #[`item.status`]="{item}">
        <v-chip
          small
          :class="`${statusColor[item.status]}--text`"
          class="v-chip-light-bg"
        >
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-col
            cols="12"
            offset-md="12"
            md="2"
          >
            <v-toolbar-title>Todo List</v-toolbar-title>
          </v-col>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-card-text>
            <v-row>
              <v-col
                cols="8"
                offset-md="8"
                md="4"
              >
                <v-text-field
                  v-model="search"
                  :append-icon="icons.mdiMagnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="800px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Create Todo
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <task-form
                  :todo-data="editedItem"
                  @clicked="dialog=false"
                ></task-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                Are you sure you want to delete this item?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="error"
                  text
                  @click="closeDelete"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="success"
                  text
                  @click="deleteItemConfirm"
                >
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          {{ icons.mdiAccountEdit }}
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          {{ icons.mdiDeleteCircle }}
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
        >
          Refresh
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mdiAccountEdit, mdiDeleteCircle, mdiMagnify } from '@mdi/js'
import { ref } from '@vue/composition-api'
import TaskForm from '@/views/dashboard/TaskForm.vue'

export default {
  components: {
    TaskForm,
  },
  setup() {
    const search = ref('')

    const statusColor = {
      Todo: 'info',
      Done: 'success',
      Cancelled: 'error',
    }

    return {
      icons: {
        mdiAccountEdit,
        mdiDeleteCircle,
        mdiMagnify,
      },
      search,
      statusColor,
    }
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Task',
        align: 'start',
        sortable: true,
        value: 'task',
      },
      { text: 'Status', value: 'status' },
      { text: 'Date Created', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      abilities: [],
      title: '',
      name: '',
      scope: '',
      date_created: '',
      actions: '',
    },
    defaultItem: {
      abilities: [],
      title: '',
      name: '',
      scope: '',
      date_created: '',
      actions: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Todo' : 'Edit Todo'
    },
    todos() {
      return this.$store.state.UserAccessManagementStore.todos.map(todo => {
        // eslint-disable-next-line no-param-reassign
        todo.status = todo.status.charAt(0).toUpperCase() + todo.status.slice(1)

        return todo
      })
    },
    loading() {
      return this.$store.state.UserAccessManagementStore.loading
    },
  },

  watch: {
    dialog(val) {
      return val || this.close()
    },
    dialogDelete(val) {
      return val || this.closeDelete()
    },
  },
  created() {
    this.$store.dispatch('UserAccessManagementStore/getTodos')
  },
  methods: {
    editItem(item) {
      this.$store.dispatch('UserAccessManagementStore/removeErrors')
      this.editedIndex = this.todos.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.todos.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$store.dispatch('UserAccessManagementStore/getTodos')
      this.$store.dispatch('UserAccessManagementStore/deleteTodo', this.todos[this.editedIndex])
      this.todos.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.todos[this.editedIndex], this.editedItem)
      } else {
        this.todos.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
