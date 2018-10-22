<template>
  <div class="test-visualization-display">
    <p>View your colorful circles below.</p>
    <div class="vis">
      <svg viewBox="0 0 500 100"></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: {
    data: { default: null, required: true, type: Array }
  },
  data () {
    return {
      container: null,
      svg: null,
      canvas: null,
      width: 500, // get from data if option made available
      height: 100 // get from data if option made available
    }
  },
  computed: {
    colorScale () {
      return d3.scaleSequential(d3.interpolatePlasma)
        .domain([1, Math.max(...this.data)])
    }
  },
  methods: {
    init () {
      this.container = d3.select('.vis')
      this.svg = d3.select('svg')
      this.canvas = this.svg.append('g')

      // This very simple example is not redrawing dynamically on resize,
      // so we won't care about getting and setting width values based on browser
    },
    draw () {
      // do data stuff
      let circlesBound = this.canvas.selectAll('circle').data(this.data)

      // update, these actions will be applied to existing elements
      circlesBound
        .transition().duration(2000)
        .attr('r', (d) => d)
        .attr('fill', (d) => this.colorScale(d))
        .attr('cx', (d) => (Math.floor(Math.random() * (this.width - 2 * d))) + d)
        .attr('cy', (d) => (Math.floor(Math.random() * (this.height - 2 * d))) + d)

      // enter, these actions will be applied to new elements
      circlesBound
        .enter()
        .append('circle')
        .attr('r', 0)
        .attr('opacity', 0.7)
        .attr('fill', '#ffffff')
        .attr('r', (d) => d)
        .attr('fill', (d) => this.colorScale(d))
        .attr('cx', (d) => (Math.floor(Math.random() * (this.width - 2 * d))) + d)
        .attr('cy', (d) => (Math.floor(Math.random() * (this.height - 2 * d))) + d)

      // exit, these actions will be applied to elements that have been removed
      circlesBound
        .exit()
        .transition().duration(2000)
        .attr('r', 0)
        .attr('cx', this.width / 2)
        .attr('cy', this.height / 2)
        .remove()
    },
    resizeVisualization () {
      this.draw()
    }
  },
  mounted () {
    this.init()
    this.draw()
    // If we needed a redraw on resize, we'd add it here
    // window.addEventListener('resize', this.resizeVisualization)
  },
  beforeDestroy () {
    // And we'd remove it here
    // window.removeEventListener('resize', this.resizeVisualization)
  },
  watch: {
    data (newData, oldData) {
      this.draw()
    }
  }
}
</script>

<style lang="scss">
.vis {
  border: 2px solid $black;
  border-radius: 2px;
}
</style>
