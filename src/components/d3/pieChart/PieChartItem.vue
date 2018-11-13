<template>
  <div :class="['item', {'is-being-edited':isBeingEdited}]" :style="{'border-color': group.color}">
    <template v-if="!this.isBeingEdited">
      <button class="button is-small edit is-icon" @click.prevent="startEditing" title="Edit">
        <span class="icon"><i class="fas fa-edit"></i></span>
      </button>
      <label class="label">{{ group.label }}</label>
      <p>Value: {{ group.value }}</p>
    </template>
    <template v-else>
      <form @submit.prevent="updateItem" class="item-edit">

        <div class="field value-input">
          <label class="label" for="currentValue">{{ group.label }}</label>
          <div class="control">
            <input type="text" class="input is-small" required v-model="current.value" name="currentValue" id="currentValue">
            <p class="help is-danger" v-show="!validation.value">The value must be a number.</p>
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

export default {
  props: {
    group: { required: true, type: Object },
    groupIndex: { required: true },
    setIndex: { required: true }
  },
  data () {
    return {
      // copy of saved data
      current: {
        value: this.group.value
      },
      validation: {
        value: true
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
      // color
      let valid = true

      if (regexPatterns.number.test(this.current.value)) {
        this.validation.value = true
      } else {
        this.validation.value = false
        valid = false
      }

      return valid
    },
    updateItem () {
      if (this.validate()) {
        // update data on parent...
        this.$emit('update:item', {
          currentItem: this.current,
          setIndex: this.setIndex,
          groupIndex: this.groupIndex
        })
        this.isBeingEdited = false
        this.$emit('changeEditingState', { uuid: this.uuid, editing: this.isBeingEdited })
      }
    },
    resetValues () {
      // reset
      this.current = {
        value: this.group.value
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
.item {
  position: relative;
  padding: 5px 10px;
  border: 2px solid $light-gray;
  border-radius: 3px;
  .edit {
    position: absolute;
    top: 0;
    right: 0;
  }
  & > label {
    padding-right: 65px;
  }
}

.item-edit {
  .value-input:not(:last-child) {
    margin-bottom: 0;
    label {
      padding-right: 65px;
      margin-bottom: 5px;
    }
  }
  .form-buttons {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
