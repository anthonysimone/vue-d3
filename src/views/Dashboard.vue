<template>
  <div class="dashboard">
    <page-header pageTitle="Dashboard" subTitle="This is your dashboard!"></page-header>
    <div class="container">
      <section class="section">
        <ul class="columns is-multiline" v-if="visualizationsByUser && visualizationsByUser.length">
          <li class="column is-one-third" v-for="vis in visualizationsByUser" :key="vis.id">
            <visualization-teaser :visualization="vis"></visualization-teaser>
          </li>
        </ul>
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
  computed: {
    ...mapGetters('visualization', ['visualizationsByUser'])
  }
}
</script>
