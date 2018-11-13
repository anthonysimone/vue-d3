<template>
  <div class="pie-chart__edit edit-container">
    <!-- content section -->
    <div class="content-section content">
      <p>You can edit all of the data that supports your visualization here. You'll see your visualization in action below. The visualization will be updated every time you save your data.</p>
      <p>You will input your data for this pie chart by creating <b>Data Groups</b> and <b>Data Sets</b>. A data group can be thought of as a slice of the pie. If your pie chart was displaying types of fruit eaten, a data group might be "Apples". A data set can be thought of as a single instance of each data group. Again with the fruit example, you might want to show the different types of fruit eaten on each day of the week. In this case, your data sets would be "Monday", "Tuesday", etc. So, if your pie chart will not be dynamic, you will only need a single data set. Every data group must have a value for each set created, however, a value of 0 is valid.
      <p>Start a new pie chart by adding your first data set. Then add at least one data group. If you add multiple datasets, you will be able to transition between them</p>
      <div class="buttons">
        <button class="button is-primary is-small"
          @click.prevent="$modal.show('add-new-group')"
          :disabled="editData.length === 0">Add New Data Group</button>
        <button class="button is-primary is-small" @click.prevent="$modal.show('add-new-set')">Add New Data Set</button>
      </div>
    </div>

    <!-- data groups -->
    <div class="groups-section">
      <h3 class="title is-4">Data Groups</h3>
      <div class="groups" v-if="groups.length > 0">
        <div class="columns with-max">
          <div class="column max-4" v-for="(group, index) in groups" :key="group.id">
            <pie-chart-group
              :group="group"
              :groupIndex="index"
              @update:group="updateGroup"
              @delete:group="deleteGroup">
            </pie-chart-group>
          </div>
        </div>
      </div>
      <p v-else>
        You haven't added any <b>data groups</b> yet! These are the categories your data is broken up by in the pie chart. Go add some!
      </p>
    </div>

    <!-- data sets and items -->
    <div class="datasets-section">
      <h3 class="title is-4">Data Sets</h3>
      <template v-if="editData.length > 0">
        <div class="dataset" v-for="(set, setIndex) in editData" :key="set.setId">

          <!-- set -->
          <pie-chart-set
            :set="set"
            :setIndex="setIndex"
            @update:set="updateSet"></pie-chart-set>

          <div class="columns with-max">
            <div class="column max-4" v-for="(group, groupIndex) in set.values" :key="group.id">
              <!-- item -->
              <pie-chart-item
                :group="group"
                :groupIndex="groupIndex"
                :setIndex="setIndex"
                @update:item="updateItem"
                @changeEditingState="changeEditingState"></pie-chart-item>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button class="button is-primary" @click.prevent="updateData" :disabled="!hasBeenEdited">Save Data</button>
          <button class="button is-danger" @click.prevent="resetData" :disabled="!hasBeenEdited">Reset</button>
        </div>
      </template>
      <template v-else>
        <p>You haven't added any <b>data sets</b> yet! You must add at least one data set to get started. Do this first!</p>
      </template>
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
import PieChartItem from '@/components/d3/pieChart/PieChartItem'
import PieChartGroup from '@/components/d3/pieChart/PieChartGroup'
import PieChartSet from '@/components/d3/pieChart/PieChartSet'

export default {
  components: {
    PieChartItem,
    PieChartGroup,
    PieChartSet
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
        color: ''
      },
      itemsCurrentlyBeingEdited: [],
      hasBeenEdited: false
    }
  },
  computed: {
    groups () {
      if (this.editData.length > 0 && this.editData[0].values.length > 0) {
        return JSON.parse(JSON.stringify(this.editData[0].values))
      } else {
        return []
      }
    },
    isBeingEdited () {
      return this.itemsCurrentlyBeingEdited.length > 0
    }
  },
  methods: {
    validateGroup () {
      if (this.newGroup.label.length > 0 &&
        this.newGroup.color.length > 0) {
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
          color: this.newGroup.color,
          value: 0
        }

        // If groups exist, find the next incrememnted id, else, start at 1
        newGroup.id = (this.groups.length > 0) ? Math.max(...this.groups.map(group => +group.id)) + 1 : 1

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
        newSet.setName = this.newSet.name
        newSet.setId = newId
        newSet.total = 0

        this.editData.push(newSet)
        this.$modal.hide('add-new-set')
        this.hasBeenEdited = true
      }
    },
    updateSet ({ currentSet, setIndex }) {
      this.hasBeenEdited = true
      this.editData[setIndex].setName = currentSet.name
    },
    resetSet () {
      this.newSet = {
        name: ''
      }
      this.setInvalid = false
    },
    updateItem ({ currentItem, setIndex, groupIndex }) {
      this.hasBeenEdited = true
      let itemToUpdate = this.editData[setIndex].values[groupIndex]
      // update value
      itemToUpdate.value = currentItem.value
    },
    updateGroup ({ currentGroup, groupIndex }) {
      this.hasBeenEdited = true
      let groupToUpdate = this.editData[0].values[groupIndex]

      // looping through sets and using groupIndex
      if (groupToUpdate.label !== currentGroup.name) {
        for (let i = 0; i < this.editData.length; i++) {
          this.editData[i].values[groupIndex].label = currentGroup.name
        }
      }
      // check if color changed and update globally
      if (groupToUpdate.color !== currentGroup.color) {
        for (let i = 0; i < this.editData.length; i++) {
          this.editData[i].values[groupIndex].color = currentGroup.color
        }
      }
    },
    deleteGroup ({ group, groupIndex }) {
      this.hasBeenEdited = true
      this.editData.forEach((set, i) => {
        // we are getting the index by ID for now, in case any data might be stored out of order
        let index = set.values.findIndex(item => item.id === group.id)
        set.values.splice(index, 1)
      })
    },
    // Validate, then update data on parent
    updateData () {
      if (this.isBeingEdited) {
        alert('you must finish editing before you can save')
      } else {
        this.hasBeenEdited = false
        this.$emit('dataUpdated', this.editData)
      }
    },
    resetData () {
      this.editData = JSON.parse(JSON.stringify(this.data))
      this.hasBeenEdited = false
    },
    changeEditingState ({ uuid, editing }) {
      if (editing) {
        this.itemsCurrentlyBeingEdited.push(uuid)
      } else {
        this.itemsCurrentlyBeingEdited.splice(this.itemsCurrentlyBeingEdited.indexOf(uuid), 1)
      }
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

.default-modal-content {
  padding: 15px;
}

.is-new {
  background-color: rgba($danger, 0.05)
}

.edit-container > div:not(:first-child) {
  margin-top: 35px;
}
</style>
