<template>
  <div class="test-visualization-display">
    <p>View your colorful circles below.</p>
    <svg viewBox="0 0 500 100"></svg>
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
      svg: null,
      canvas: null,
      width: 500,
      height: 100
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
      this.svg = d3.select('svg')
      this.canvas = this.svg.append('g')
    },
    draw () {
      // enter, bind data
      this.canvas.selectAll('circle')
        .data(this.data)
        .enter()
        .append('circle')
        .attr('r', 0)
        .attr('opacity', 0.7)
        .attr('fill', '#ffffff')
        .attr('cx', this.width / 2)
        .attr('cy', this.height / 2)

      // update, we want the update to run for ALL elements, even entered ones, so we don't bind data
      this.canvas.selectAll('circle')
        .transition().duration(2000)
        .attr('r', (d) => d)
        .attr('fill', (d) => this.colorScale(d))
        .attr('cx', (d) => (Math.floor(Math.random() * (this.width - 2 * d))) + d)
        .attr('cy', (d) => (Math.floor(Math.random() * (this.height - 2 * d))) + d)

      // exit, bind data
      this.canvas.selectAll('circle').data(this.data)
        .exit()
        .transition().duration(2000)
        .attr('r', 0)
        .attr('cx', this.width / 2)
        .attr('cy', this.height / 2)
        .remove()
    }
  },
  mounted () {
    this.init()
    this.draw()
  },
  watch: {
    data (newData, oldData) {
      this.draw()
    }
  }
}
</script>

<style lang="scss"></style>
