<template>
  <div class="visualization-detail">
    <page-header :pageTitle="visualization.name" :subTitle="typeLabel"></page-header>
    <div class="container">

      <!-- Edit Chart -->
      <section class="section">
        <h3 class="title is-h3">Edit Visualization</h3>
        <component :is="visEditComponentName" :data="visData" @dataUpdated="updateData"></component>
      </section>

      <!-- Display Chart -->
      <section class="section">
        <h3 class="title is-h3">Display Visualization</h3>
        <component :is="visDisplayComponentName" :data="visData"></component>
      </section>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/elements/layout/PageHeader'
import visTypes from '@/store/static/visualizationTypes'
// import testData from '@/store/static/d3-models/allDataModels'

// Import all possible D3 display and edit templates
import TestVisualization from '@/components/d3/TestVisualization'
import EditTestVisualization from '@/components/d3/EditTestVisualization'
import PieChart from '@/components/d3/PieChart'
import EditPieChart from '@/components/d3/EditPieChart'

export default {
  components: {
    PageHeader,
    TestVisualization,
    EditTestVisualization,
    PieChart,
    EditPieChart
  },
  data () {
    return {
      id: this.$route.params.id,
      visData: []
    }
  },
  computed: {
    ...mapGetters('visualization', ['visualizationById']),
    visualization () {
      return this.visualizationById(this.id)
    },
    typeLabel () {
      return visTypes.getNameById(this.visualization.type)
    },
    visEditComponentName () {
      return `Edit${visTypes.getTemplateNameById(this.visualization.type)}`
    },
    visDisplayComponentName () {
      return visTypes.getTemplateNameById(this.visualization.type)
    }
  },
  methods: {
    updateData (data) {
      // Update data property on component
      console.log('caught update event')
      this.visData = data

      // Update action
      this.$store.dispatch('visualization/updateVisualization', {
        id: this.id,
        // updatedData: { data: JSON.stringify(data) },
        dataToUpdate: { data }
      })
    }
  },
  created () {
    // Use mock data
    // let dataKey = this.visDisplayComponentName.charAt(0).toLowerCase() + this.visDisplayComponentName.slice(1) + 'Data'
    // this.visData = testData[dataKey]

    // Use real data
    this.visData = this.visualization.data
  }
}
</script>
