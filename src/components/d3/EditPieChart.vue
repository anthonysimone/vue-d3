<template>
  <div class="test-visualization-display">
    <div class="content">
      <p>Edit your dataset for this Pie Chart Visualization below!</p>
      <p>For simplicity sake, you can add new data groups and new data sets. Every data group <em><b>must</b></em> have valid data for every set. It is ok if the value is 0.</p>
      <p>Start a new pie chart by adding your first data set. Then add at least one data group. If you add multiple datasets, you will be able to transition between them</p>
    </div>
    <div class="buttons">
      <button class="button is-primary is-small"
        @click.prevent="$modal.show('add-new-group')"
        :disabled="editData.length === 0">Add New Data Group</button>
      <button class="button is-primary is-small" @click.prevent="$modal.show('add-new-set')">Add New Data Set</button>
    </div>
    <div>
      <div :class="['dataset', {'is-new':set.isNew}]" v-for="(set, setIndex) in editData" :key="set.setId">
        <h4 class="title is-5">{{ set.setName }}</h4>
        <div class="columns with-max">
          <div :class="['column', 'max-4', {'is-new':group.isNew}]" v-for="(group, groupIndex) in set.values" :key="group.id">
            <pie-chart-item
              :group="group"
              :groupIndex="groupIndex"
              :setIndex="setIndex"
              :formAlreadyBeingEdited="isBeingEdited"
              @itemUpdated="updateItemData"
              @changeEditingState="changeEditingState"></pie-chart-item>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" @click.prevent="updateData" :disabled="!hasBeenEdited">Save Data</button>
        <button class="button is-danger" @click.prevent="resetData" :disabled="!hasBeenEdited">Reset</button>
      </div>
    </div>

    <!-- Add data modals -->
    <modal name="add-new-group"
      @closed="resetGroup"
      :scrollable="true"
      height="auto">
      <div class="default-modal-content">
        <h3 class="title is-h3">Add New Data Group</h3>
        <p>Adding a new data group for your pie chart will add it to <em><b>every</b></em> data set. The value can be 0 if a set has no relevant data for a group.</p>
        <form @submit.prevent="addGroup">
          <div class="field">
            <label class="label" for="newGroupName">Group Name</label>
            <div class="control">
              <input type="text" class="input" required v-model="newGroup.label" name="newGroupName" id="newGroupName">
            </div>
          </div>

          <div class="field">
            <label class="label" for="newGroupId">Group ID</label>
            <div class="control">
              <input type="text" class="input" required v-model="newGroup.id" name="newGroupId" id="newGroupId">
            </div>
          </div>

          <div class="field">
            <label class="label" for="newGroupColor">Color</label>
            <div class="control">
              <input type="text" class="input" required v-model="newGroup.color" name="newGroupColor" id="newGroupColor">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-primary">Add Data Group</button>
            </div>
          </div>
        </form>
      </div>
    </modal>
    <modal name="add-new-set"
      @closed="resetSet"
      :scrollable="true"
      height="auto">
      <div class="default-modal-content">
        <h3 class="title is-h3">Add New Data Set</h3>
        <p>Adding a new data set for your pie chart will a new set with <em><b>every</b></em> data group present. The value can be 0 if a group has no relevant data for a set.</p>
        <form @submit.prevent="addSet">
          <div class="field">
            <label class="label" for="newSetName">Name</label>
            <div class="control">
              <input type="text" class="input" required v-model="newSet.name" name="newSetName" id="newSetName">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-primary">Add Data Set</button>
            </div>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
// import pieChartModel from '@/store/static/d3-models/pieChartData'
import PieChartItem from '@/components/d3/PieChartItem'

export default {
  components: {
    PieChartItem
  },
  props: {
    data: { default: null, required: true, type: Array }
  },
  data () {
    return {
      // copy of saved data
      editData: JSON.parse(JSON.stringify(this.data)),
      invalidData: false,
      setInvalid: false,
      newSet: {
        name: ''
      },
      groupInvalid: false,
      newGroup: {
        label: '',
        color: '',
        id: ''
      },
      isBeingEdited: false,
      hasBeenEdited: false
    }
  },
  computed: {
  },
  methods: {
    validateGroup () {
      if (this.newGroup.label.length > 0 &&
        this.newGroup.color.length > 0 &&
        this.newGroup.id.length > 0) {
        this.setInvalid = false
        return true
      } else {
        this.setInvalid = true
        return false
      }
    },
    addGroup () {
      if (this.validateGroup()) {
        let newGroup = {
          label: this.newGroup.label,
          id: this.newGroup.id,
          color: this.newGroup.color,
          value: 0
        }
        this.editData.forEach(set => {
          // Create shallow copy of object for each set
          set.values.push(Object.assign({}, newGroup))
        })
        this.$modal.hide('add-new-group')
        this.hasBeenEdited = true
      }
    },
    resetGroup () {
      this.newGroup = {
        label: '',
        color: '',
        id: ''
      }
      this.groupInvalid = false
    },
    validateSet () {
      if (this.newSet.name.length > 0) {
        this.setInvalid = false
        return true
      } else {
        this.setInvalid = true
        return false
      }
    },
    addSet () {
      if (this.validateSet()) {
        let newSet, newId
        if (this.editData.length === 0) {
          newId = 1
        } else {
          let ids = this.editData.map(set => set.setId)
          newId = Math.max(...ids) + 1
        }
        if (this.editData.length > 0) {
          newSet = JSON.parse(JSON.stringify(this.editData[0]))
          newSet.values.forEach(group => {
            group.value = 0
          })
        } else {
          newSet = {
            values: []
          }
        }
        newSet.isNew = true
        newSet.setName = this.newSet.name
        newSet.setId = newId
        newSet.total = 0

        this.editData.push(newSet)
        this.$modal.hide('add-new-set')
        this.hasBeenEdited = true
      }
    },
    resetSet () {
      this.newSet = {
        name: ''
      }
      this.setInvalid = false
    },
    updateItemData (data) {
      this.hasBeenEdited = true
      let { currentItem, setIndex, groupIndex } = data
      let itemToUpdate = this.editData[setIndex].values[groupIndex]
      // update value
      itemToUpdate.value = currentItem.value
      // check if label, id, or color changed and update globally by
      // looping through sets and using groupIndex
      if (itemToUpdate.label !== currentItem.name) {
        console.log('update label globally')
        for (let i = 0; i < this.editData.length; i++) {
          console.log(this.editData[i].values[groupIndex].label)
          this.editData[i].values[groupIndex].label = currentItem.name
        }
      }
      // check if id changed and update globally
      if (itemToUpdate.id !== currentItem.id) {
        console.log('update id globally')
        for (let i = 0; i < this.editData.length; i++) {
          this.editData[i].values[groupIndex].id = currentItem.id
        }
      }
      // check if color changed and update globally
      if (itemToUpdate.color !== currentItem.color) {
        console.log('update color globally')
        for (let i = 0; i < this.editData.length; i++) {
          this.editData[i].values[groupIndex].color = currentItem.color
        }
      }
    },
    // Validate, then update data on parent
    updateData () {
      if (this.isBeingEdited) {
        alert('you must finish editing before you can save')
      } else {
        // At this point, validation should have already happened on individual item edits
        for (let i = 0; i < this.editData.length; i++) {
          let set = this.editData[i]
          if (set.hasOwnProperty('isNew')) {
            delete set.isNew
          }
          for (let j = 0; j < set.values.length; j++) {
            let group = set.values[j]
            if (group.hasOwnProperty('isNew')) {
              delete group.isNew
            }
          }
        }
        this.hasBeenEdited = false
        this.$emit('dataUpdated', this.editData)
      }
    },
    resetData () {
      this.editData = JSON.parse(JSON.stringify(this.data))
      this.hasBeenEdited = false
    },
    changeEditingState (data) {
      console.log('change editing state')
      console.log(data)
      this.isBeingEdited = data
    }
  }
}
</script>

<style lang="scss">
.dataset {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
}

.group {
  padding: 10px;
  border: 2px solid $light-gray;
  border-radius: 3px;
}

.default-modal-content {
  padding: 15px;
}

.is-new {
  background-color: rgba($danger, 0.05)
}
</style>
