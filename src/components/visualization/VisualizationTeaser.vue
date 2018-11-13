<template>
  <div class="visualization-teaser card">
    <div class="card-content">
      <h4 class="title is-5">{{ visualization.name }}</h4>
      <p>Visualization of type: {{ visualization.type }}</p>
      <p>id: {{ visualization.id }}</p>
      <router-link class="button is-primary is-small" :to="{name: 'visualization-detail', params: {id: visualization.id}}">View</router-link>
      <confirmation-modal @confirmationSuccess="deleteVisualization(visualization.id)" dialog-title="Warning!" :dialog-body="dialogWarningBody" classes="delete">Delete</confirmation-modal>
    </div>
  </div>
</template>

<script>
import ConfirmationModal from '@/components/elements/functional/ConfirmationModal'

export default {
  components: {
    ConfirmationModal
  },
  props: {
    visualization: { required: true, type: Object }
  },
  computed: {
    dialogWarningBody () {
      return `You are about to delete the visualization called "${this.visualization.name}" and all of its data. This is permanent and you cannot undo this action. Do you want to continue?`
    }
  },
  methods: {
    deleteVisualization (id) {
      this.$store.dispatch('visualization/deleteVisualization', id)
    }
  }
}
</script>

<style lang="scss">
.delete {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba($danger, 0.6);
  &:hover {
    background-color: rgba($danger, 0.9);
  }
}
</style>
