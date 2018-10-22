<template>
  <div class="pie-chart">
    <p>The template to view the pie chart visualization.</p>
    <div class="vis">
      <svg viewBox="0 0 500 500"></svg>
    </div>
  </div>
</template>

<script>
// TODO: refactor this to only use the appropriate modules
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
      width: 500,
      height: 500,
      d3Local: d3.local()
    }
  },
  computed: {
    colorScale () {
      // return an ordinal color scale based on all values provided
      return d3.scaleOrdinal(this.data.map(item => item.color))
    },
    total () {
      return d3.sum(this.data, (d) => d.value)
    },
    radius () {
      return Math.min(this.width, this.height) / 2
    },
    pie () {
      return d3.pie()
        .sort(null)
        .value(d => d.value)
    },
    arc () {
      return d3.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(0)
    },
    label () {
      return d3.arc()
        .outerRadius(this.radius - 100)
        .innerRadius(this.radius - 100)
    }
  },
  methods: {
    init () {
      this.container = d3.select('.vis')
      this.svg = d3.select('svg')
      this.canvas = this.svg.append('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
    },
    arcTween (d, index, nodes) {
      let i = d3.interpolate(this.d3Local.get(nodes[index]), d)
      this._current = i(0)
      return (t) => {
        return this.arc(i(t))
      }
    },

    draw () {
      // data format is expected to be like `@/store/static/d3-models/pieChart`

      console.log('drawing')

      // Get percentage for each item
      this.data.forEach((d) => {
        d.percentage = Math.floor(d.value / this.total * 100)
      })

      // join
      let arcs = this.canvas.selectAll('.arc')
        .data(this.pie(this.data))

      // update
      arcs.select('path')
        .transition().duration(7500).attrTween('d', this.arcTween)
      // arcs.select('text')
      //   .transition().duration(7500)
      //     .attr('transform', d => 'translate(' + this.label.centroid(d) + ')')
      //     .attr('dy', '0.35em')
      //     .text(d => d.data.percentage + '%')

      // enter
      arcs.enter()
        .append('g')
        .attr('class', 'arc')
        .append('path')
        .attr('fill', d => this.colorScale(d.data.value))
        .attr('d', this.arc)
        .each((d, i, nodes) => {
          // store the current data set on the node for access in the tween
          this.d3Local.set(nodes[i], d)
        })

      // arcs.enter().append('text')
      //   .attr('transform', d => 'translate(' + this.label.centroid(d) + ')')
      //   .attr('dy', '0.35em')
      //   .text(d => d.data.percentage + '%')
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
