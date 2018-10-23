<template>
  <div class="add-visualization">
    <page-header pageTitle="Add" subTitle="Add a new visualization to your dashboard!"></page-header>
    <div class="container">
      <section class="section">
        <form @submit.prevent="submitForm" @keyup="validateForm">

          <div class="field">
            <label class="label" for="newVisualizationName">Name</label>
            <div class="control">
              <input type="text" class="input" required v-model="newVisualization.name" name="newVisualizationName">
            </div>
          </div>

          <div class="field">
            <label class="label" for="newVisualizationType">Type</label>
            <div class="control">
              <div class="select">
                <select class="select" v-model="newVisualization.type" name="newVisualizationType">
                  <option value="test">Test</option>
                  <option value="pie">Pie Chart</option>
                  <option value="line">Line Graph</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button :class="['button', 'is-primary', {'is-loading': waitingForResponse}]" :disabled="formIsDisabled">Add Visualization</button>
            </div>
          </div>

        </form>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/elements/layout/PageHeader'

export default {
  components: {
    PageHeader
  },
  data () {
    return {
      newVisualization: {
        name: '',
        type: 'test',
        createdBy: '',
        data: []
      },
      formIsDisabled: true,
      waitingForResponse: false
    }
  },
  computed: {
    ...mapGetters('user', ['userProfile'])
  },
  methods: {
    submitForm () {
      this.waitingForResponse = true
      this.$store.dispatch('visualization/addVisualization', this.newVisualization)
        .then(response => {
          this.$router.push({ name: 'visualization-detail', params: { id: response } })
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.waitingForResponse = false
        })
    },
    validateForm () {
      this.formIsDisabled = !(this.newVisualization.name)
    }
  },
  mounted () {
    // On mount, add the created by key for current user
    this.newVisualization.createdBy = this.userProfile.id
  }
}
</script>
