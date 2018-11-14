<template>
  <div class="new-viz">
    <!-- Any markup that this visualization depends on. -->
  </div>
</template>

<script>
// TODO: refactor this to only use the appropriate modules
import * as d3 from 'd3'
// import pieChartModel from '@/store/static/d3-models/pieChartData'

export default {
  props: {
    data: { default: null, required: true, type: Array }
  },
  data () {
    return {
      // All constant or bound variables defined and used by the visualization
      container: null,
      svg: null,
      canvas: null,
      tooltip: null,
      width: 400,
      height: 400,
      currentIndex: (this.data.length > 0) ? this.data[0].setId : null,
      d3Local: d3.local() // May be used if you need local store per bound element
    }
  },
  computed: {
    // Computed properties will set all dynamic items here, like currentData, scales, dependent variables, constructs like arcs, lines, etc. Everything that will be used by the visualization
    // currentData () {},
    // someScale () {},
    // pie () {},
    // arc () {}
  },
  methods: {
    // Methods will define all behaviors that will be used like init, draw, tweens, etc
    init () {
      // Everything necessary to initialize the visualization. This function will be run ONCE, defined by component.
    },
    draw () {
      // Draw method will always be needed. Most things should be extracted out to computed properties or methods, and draw mostly will only be defining enter, update, exit
    }
  },
  mounted () {
    // Initialize and first draw, this may look different depending on the visualization needs.
    this.init()
    this.draw()
  },
  watch: {
    // You might be watching a value like currentData and redrawing, you might need a deep watcher
  }
}
</script>

<style lang="scss">
</style>
