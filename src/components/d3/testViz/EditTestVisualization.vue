<template>
  <div class="test-visualization-display">
    <div class="content">
      <p>Edit your dataset for this Test Visualization below! Add a new number value on each line. Only use numbers, and do not leave any empty lines.</p>
    </div>
    <form @submit.prevent="updateData">
      <div class="field">
        <div class="control">
          <textarea :class="['textarea', 'is-small', {'is-danger': invalidData}]" v-model="dataTransform" rows="10"></textarea>
          <p class="help is-danger" v-show="invalidData">You have entered some non-numberic data. Please make sure you've only entered numbers and each value is on a new line.</p>
        </div>
      </div>

    <button class="button is-primary">Save Data</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    data: { default: null, required: true, type: Array }
  },
  data () {
    return {
      editData: this.data.slice(),
      invalidData: false
    }
  },
  computed: {
    dataTransform: {
      get () {
        return this.editData.join('\n')
      },
      set (newValue) {
        this.editData = newValue.split('\n').map(d => {
          return (Number.isNaN(parseInt(d))) ? d : parseInt(d)
        })
      }
    }
  },
  methods: {
    // Validate, then update data on parent
    updateData () {
      if (this.editData.filter(d => Number.isNaN(parseInt(d))).length === 0) {
        // All items are numbers, continue setting data
        this.invalidData = false
        this.$emit('dataUpdated', this.editData)
      } else {
        this.invalidData = true
      }
    }
  }
}
</script>

<style lang="scss"></style>
