<template>
  <div class="pie-chart">
    <p>The template to view the pie chart visualization.</p>
    <svg viewBox="0 0 500 500"></svg>
  </div>
</template>

<script>
// TODO: refactor this to only use the appropriate modules
import * as d3 from 'd3'

export default {
  props: {
    data: { default: null, required: true, type: Array }
  },

  mounted () {
    // data format is expected to be like `@/store/static/d3-models/pieChart`
    let data = this.data

    // Get total and percentage for each item
    let total = d3.sum(data, (d) => d.value)
    data.forEach((d) => {
      d.percentage = Math.floor(d.value / total * 100)
    })

    // get the array of colors from our data object
    let colors = data.map(item => item.color)

    // Do initial d3 canvas setup
    let svg = d3.select('svg')
    let width = 500
    let height = 500
    let radius = Math.min(width, height) / 2
    let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    // define color scale from color array
    let color = d3.scaleOrdinal(colors)

    // define the pie function
    let pie = d3.pie()
      .sort(null)
      .value(function (d) { return d.value })

    let path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0)

    let label = d3.arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 100)

    let arc = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc')

    arc.append('path')
      .attr('d', path)
      .attr('fill', function (d) { return color(d.data.value) })

    arc.append('text')
      .attr('transform', function (d) { return 'translate(' + label.centroid(d) + ')' })
      .attr('dy', '0.35em')
      .text(function (d) { return d.data.percentage + '%' })
  }
}
</script>

<style lang="scss">
.arc {
  text {
    font-size: 40px;
    text-anchor: middle;
    font-weight: 600;
    fill: #fff;
  }
  path {
    stroke: #fff;
    stroke-width: 5px;
  }
}
</style>
