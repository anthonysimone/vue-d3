<template>
  <div :class="['group', {'is-being-edited':isBeingEdited}]" :style="{'border-color': group.color}">
    <template v-if="!this.isBeingEdited">
      <div class="form-buttons">
        <div class="buttons">
          <button class="button is-small edit is-icon" @click.prevent="startEditing" title="Edit">
            <span class="icon"><i class="fas fa-edit"></i></span>
          </button>
          <confirmation-modal @confirmationSuccess="deleteGroup" dialog-title="Warning!" :dialog-body="dialogWarningBody" classes="button is-small trash is-icon">
            <span class="icon"><i class="fas fa-trash-alt"></i></span>
          </confirmation-modal>
        </div>
      </div>
      <span class="label">{{ group.label }} ({{ group.color }})</span>
    </template>
    <template v-else>
      <form @submit.prevent="updateGroup">

        <div class="field">
          <label class="label" for="currentName">Name</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.name" name="currentName" id="currentName">
          </div>
        </div>

        <div class="field">
          <label class="label" for="currentColor">Color</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.color" name="currentColor" id="currentColor">
            <p class="help is-danger" v-show="!validation.color">The current value is not a valid color string or hex value.</p>
          </div>
        </div>

        <div class="field form-buttons">
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
import regexPatterns from '@/store/static/regexPatterns'
import ConfirmationModal from '@/components/elements/functional/ConfirmationModal'

export default {
  components: {
    ConfirmationModal
  },
  props: {
    group: { required: true, type: Object },
    groupIndex: { required: true }
  },
  data () {
    return {
      // copy of saved data
      current: {
        name: this.group.label,
        color: this.group.color
      },
      validation: {
        name: true,
        color: true
      },
      isBeingEdited: false
    }
  },
  computed: {
    dialogWarningBody () {
      return `You're about to delete the group '${this.group.label}' from this visualization. Data in this group will be deleted from all sets. Once you delete this item and save, you cannot undo this action. Do you want to continue?`
    }
  },
  methods: {
    startEditing () {
      this.isBeingEdited = true
      this.$emit('changeEditingState', { uuid: this.uuid, editing: this.isBeingEdited })
    },
    validate () {
      // color
      let valid = true

      if (regexPatterns.hexColor.test(this.current.color) || regexPatterns.alphaLower.test(this.current.color)) {
        this.validation.color = true
      } else {
        this.validation.color = false
        valid = false
      }

      return valid
    },
    updateGroup () {
      console.log('update group')
      if (this.validate()) {
        // update data on parent...
        this.$emit('update:group', {
          currentGroup: this.current,
          groupIndex: this.groupIndex
        })
        this.isBeingEdited = false
        this.$emit('changeEditingState', { uuid: this.uuid, editing: this.isBeingEdited })
      }
    },
    deleteGroup () {
      this.$emit('delete:group', {
        group: this.group,
        groupIndex: this.groupIndex
      })
    },
    resetValues () {
      // reset
      this.current = {
        name: this.group.label,
        color: this.group.color
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
      this.$emit('changeEditingState', { uuid: this.uuid, editing: this.isBeingEdited })
    }
  },
  beforeDestroy () {
    this.$emit('changeEditingState', { uuid: this.uuid, editing: false })
  }
}
</script>

<style lang="scss">
.group {
  position: relative;
  padding: 5px 10px;
  border: 2px solid $light-gray;
  border-radius: 3px;
  & > .label {
    padding-right: 65px;
  }
}

.form-buttons {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
