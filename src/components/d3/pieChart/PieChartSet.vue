<template>
  <div class="set">
    <template v-if="!this.isBeingEdited">
      <div class="set-title">
        <h4 class="title is-5">{{ set.setName }}</h4>
        <button class="button is-small edit is-icon" @click.prevent="startEditing" title="Edit">
          <span class="icon"><i class="fas fa-edit"></i></span>
        </button>
      </div>
    </template>
    <template v-else>
      <form class="set-edit" @submit.prevent="updateSet">

        <div class="field visually-hidden-label">
          <label class="label visually-hidden" for="currentName">Name</label>
          <div class="control">
            <input type="text" class="input is-small" required v-model="current.name" name="currentName" id="currentName">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <div class="buttons">
              <button class="button is-small save is-icon" title="Update">
                <span class="icon"><i class="fas fa-check"></i></span>
              </button>
              <button class="button is-small cancel is-icon" @click.prevent="cancelUpdate" title="Cancel">
                <span class="icon"><i class="fas fa-ban"></i></span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    set: { required: true, type: Object },
    setIndex: { required: true }
  },
  data () {
    return {
      // copy of saved data
      current: {
        name: this.set.setName
      },
      validation: {
        name: true
      },
      isBeingEdited: false
    }
  },
  computed: {
  },
  methods: {
    startEditing () {
      this.isBeingEdited = true
      this.$emit('changeEditingState', { uuid: this.uuid, editing: this.isBeingEdited })
    },
    validate () {
      // name
      let valid = true

      if (this.current.name.length > 0) {
        this.validation.name = true
      } else {
        this.validation.name = false
        valid = false
      }

      return valid
    },
    updateSet () {
      if (this.validate()) {
        // update data on parent...
        this.$emit('update:set', {
          currentSet: this.current,
          setIndex: this.setIndex
        })
        this.isBeingEdited = false
        this.$emit('changeEditingState', false)
      }
    },
    resetValues () {
      // reset
      this.current = {
        name: this.set.setName
      }
    },
    cancelUpdate () {
      // reset
      this.resetValues()
      for (let prop in this.validation) {
        this.validation[prop] = true
      }
      // close
      this.isBeingEdited = false
      this.$emit('changeEditingState', false)
    }
  },
  beforeDestroy () {
    this.$emit('changeEditingState', { uuid: this.uuid, editing: false })
  }
}
</script>

<style lang="scss">
.set-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  h4.title {
    margin-bottom: 0;
  }
  button {
    border: none;
    margin-left: 5px;
  }
}
.set-edit {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .field {
    margin: 0 0 0 10px;
    &:first-child {
      margin: 0;
    }
  }
}
</style>
