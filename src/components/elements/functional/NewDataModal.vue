<template>
  <button :class="classes" @click="openModal">
    <slot>Clear Data</slot>
  </button>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String
    },
    // dialogBody: {
    //   dialogBody: String,
    //   required: true
    // },
    submitText: {
      type: String,
      default: 'Yes'
    },
    successEventName: {
      type: String,
      default: 'confirmationSuccess'
    },
    classes: {
      type: String,
      default: 'button is-primary is-inverted'
    }
  },

  methods: {
    openModal () {
      this.$modal.show({
        template: `
          <p>Test</p>
        `
      })
    }
  }
}
</script>

<style lang="scss">
.v--modal-overlay {
  color: $body-font-color;
}
.vue-dialog-buttons {
  button:first-child {
    color: $white;
    background-color: rgba($danger, 0.8);
    &:hover {
      background-color: rgba($danger, 1);
    }
  }
}
</style>
