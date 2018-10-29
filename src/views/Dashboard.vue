<template>
  <div class="dashboard">
    <page-header pageTitle="Dashboard" subTitle="This is your dashboard!"></page-header>
    <div class="container">
      <section class="section">
        <form @submit.prevent="">
          <h4 class="title is-5">Filter Visualizations</h4>
          <div class="field">
            <label class="label" for="type">Type</label>
            <div class="control">
              <div class="select">
                <select class="select" v-model="filters.type" name="type">
                  <option value="">- All -</option>
                  <option value="test">Test</option>
                  <option value="pie">Pie Chart</option>
                  <option value="line">Line Graph</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </section>
      <section class="section">
        <div v-if="filteredVisualizations && filteredVisualizations.length">
          <transition-group name="vis-teaser" tag="ul" class="columns is-multiline content__list">
          <li class="column is-one-third vis-teaser" v-for="vis in filteredVisualizations" :key="vis.id">
            <visualization-teaser :visualization="vis"></visualization-teaser>
          </li>
          </transition-group>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/elements/layout/PageHeader'
import VisualizationTeaser from '@/components/visualization/VisualizationTeaser'

export default {
  name: 'dashboard',
  components: {
    PageHeader,
    VisualizationTeaser
  },
  data () {
    return {
      filters: {
        type: ''
      }
    }
  },
  computed: {
    ...mapGetters('visualization', ['visualizationsByUser']),
    filteredVisualizations () {
      let filteredData = this.visualizationsByUser.slice()
      for (let filter in this.filters) {
        let value = this.filters[filter]
        if (value) {
          filteredData = filteredData.filter(vis => vis[filter] === value)
        }
      }
      return filteredData
    }
  }
}
</script>

<style>
/* moving */
.vis-teaser-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.vis-teaser-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.vis-teaser-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.vis-teaser-enter,
.vis-teaser-leave-to {
  opacity: 0;
}
</style>
