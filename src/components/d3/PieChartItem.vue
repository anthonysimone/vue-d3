<template>
  <div class="group">
    <template v-if="!this.isBeingEdited">
      <button class="button is-small" @click.prevent="startEditing">Edit</button>
      <h5 class="title is-6">{{ group.label }}</h5>
      <p>Name: {{ group.label }}</p>
      <p>ID: {{ group.id }}</p>
      <p>Color: {{ group.color }}</p>
      <p>Value: {{ group.value }}</p>
    </template>
    <template v-else>
      <h5 class="title is-6">{{ current.name }}</h5>
      <form @submit.prevent="updateGroup">

        <div class="field">
          <label class="label" for="currentName">Name</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.name" name="currentName" id="currentName">
          </div>
        </div>

        <div class="field">
          <label class="label" for="currentId">ID</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.id" name="currentId" id="currentId">
            <p class="help is-danger" v-show="!validation.id">IDs must be alphanumeric (hyphens and underscores are allow).</p>
          </div>
        </div>

        <div class="field">
          <label class="label" for="currentColor">Color</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.color" name="currentColor" id="currentColor">
            <p class="help is-danger" v-show="!validation.color">The current value is not a valid color string or hex value.</p>
          </div>
        </div>

        <div class="field">
          <label class="label" for="currentValue">Value</label>
          <div class="control">
            <input type="text" class="input" required v-model="current.value" name="currentValue" id="currentValue">
            <p class="help is-danger" v-show="!validation.value">The value must be a number.</p>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <div class="buttons">
              <button class="button is-primary is-small">Update</button>
              <button class="button is-small" @click.prevent="cancelUpdate">Cancel</button>
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
    group: { required: true, type: Object },
    groupIndex: { required: true },
    setIndex: { required: true },
    formAlreadyBeingEdited: { type: Boolean }
  },
  data () {
    return {
      // copy of saved data
      current: {
        name: this.group.label,
        id: this.group.id,
        color: this.group.color,
        value: this.group.value
      },
      validation: {
        name: true,
        id: true,
        color: true,
        value: true
      },
      isBeingEdited: false
    }
  },
  computed: {
  },
  methods: {
    startEditing () {
      if (!this.formAlreadyBeingEdited) {
        this.resetValues()
        this.isBeingEdited = true
        this.$emit('changeEditingState', true)
      } else {
        alert('You can only edit 1 item at a time, please finish the currently active one.')
      }
    },
    validate () {
      // color
      let valid = true

      let hexPattern = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      let alphaPattern = /^[a-z]+$/
      let slugPattern = /^[a-z0-9\-_]+$/
      let numberPattern = /^\d+$/
      if (hexPattern.test(this.current.color) || alphaPattern.test(this.current.color)) {
        this.validation.color = true
      } else {
        this.validation.color = false
        valid = false
      }

      if (slugPattern.test(this.current.id)) {
        this.validation.id = true
      } else {
        this.validation.id = false
        valid = false
      }

      if (numberPattern.test(this.current.value)) {
        this.validation.value = true
      } else {
        this.validation.value = false
        valid = false
      }

      return valid
    },
    updateGroup () {
      if (this.validate()) {
        // update data on parent...
        this.$emit('itemUpdated', {
          currentItem: this.current,
          setIndex: this.setIndex,
          groupIndex: this.groupIndex
        })
        this.isBeingEdited = false
        this.$emit('changeEditingState', false)
      }
    },
    resetValues () {
      // reset
      this.current = {
        name: this.group.label,
        id: this.group.id,
        color: this.group.color,
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
      this.$emit('changeEditingState', false)
    }
  }
}
</script>

<style lang="scss">

</style>
