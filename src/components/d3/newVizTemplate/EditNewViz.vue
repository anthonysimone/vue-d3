<template>
  <div class="new-viz__edit edit-container">
    <!-- content section -->
    <div class="content-section content">
      <!-- Supportin content for the user. -->
      <p>Details regarding how data needs to be added to this visualization or any options that need to be explained to the user.</p>
      <!-- Actions to add types of data. Group and Set might be appropriate for a lot of visualizations. This needs to be configured for your viz. -->
      <div class="buttons">
        <button class="button is-primary is-small"
          @click.prevent="$modal.show('add-new-group')"
          :disabled="editData.length === 0">Add New Data Group</button>
        <button class="button is-primary is-small" @click.prevent="$modal.show('add-new-set')">Add New Data Set</button>
      </div>
    </div>

    <!-- Leverage child components as necessary to characterize data into groups, sets, etc -->
    <div v-for="(someDataItem, index) in editData" :key="index">
      <new-viz-item
        :someDataItem="someDataItem"
        :index="index"
        @update:someDataItem="updateSomeDataItem"
        ></new-viz-item>
    </div>

    <!-- Save and Reset functionality is needed. Save will save data to server and confirm all changes that have been made, reset will reset data back to the currently saved version of data. -->
    <div class="buttons">
      <button class="button is-primary" @click.prevent="updateData" :disabled="!hasBeenEdited">Save Data</button>
      <button class="button is-danger" @click.prevent="resetData" :disabled="!hasBeenEdited">Reset</button>
    </div>

    <!-- Modals for adding types of data groups and sets if necessary. Just an example. -->
    <modal name="add-new-data-item"
      @closed="resetDataItem"
      :scrollable="true"
      height="auto">
      <div class="default-modal-content">
        <h3 class="title is-h3">Add New Data Item</h3>
        <p>Supporting Info</p>
        <form @submit.prevent="addDataItem">
          <!-- Add fields necessary for data item -->
          <div class="field">
            <div class="control">
              <button class="button is-primary">Add Data Item</button>
            </div>
          </div>
        </form>
      </div>
    </modal>

  </div>
</template>

<script>
// import supporting data components

export default {
  components: {
  },
  props: {
    data: { default: null, required: true, type: Array }
  },
  data () {
    return {
      // Create copy of saved data passed down to this component via the data prop on creation
      editData: JSON.parse(JSON.stringify(this.data)),
      invalidData: false,
      hasBeenEdited: false
    }
  },
  computed: {

  },
  methods: {
    // need methods to validate new items added directly and catch the update events from the child components
    // addDataItem () {},
    // updateDataItem () {},
    // deleteDataItem () {}

    // Validate if necessary, then update data on parent. Every viz needs an update method that saves data
    updateData () {
      if (this.isBeingEdited) {
        alert('you must finish editing before you can save')
      } else {
        this.hasBeenEdited = false
        this.$emit('dataUpdated', this.editData)
      }
    },
    // Reset data to current stored state. Every viz could probably benefit from this
    resetData () {
      this.editData = JSON.parse(JSON.stringify(this.data))
      this.hasBeenEdited = false
    }
  }
}
</script>

<style lang="scss">

</style>
