<template>
  <div class="pie-chart">
    <div class="vis">
      <div class="select-container">
        <div class="select" v-if="this.data.length > 1">
          <select class="select" v-model.number="currentIndex">
            <option v-for="set in this.data"
              :key="set.setId"
              :value="set.setId">
              {{ set.setName }}
            </option>
          </select>
        </div>
      </div>
      <div class="vis-svg">
        <svg viewBox="0 0 500 500"></svg>
      </div>
    </div>
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
      container: null,
      svg: null,
      canvas: null,
      width: 500,
      height: 500,
      currentIndex: (this.data.length > 0) ? this.data[0].setId : null,
      d3Local: d3.local()
    }
  },
  computed: {
    // TODO: account for uneven sets, OR make that a validation process in data entry
    currentData () {
      if (this.currentIndex) {
        return this.data[this.data.findIndex(item => item.setId === this.currentIndex)]
      } else {
        return this.data[0]
      }

      // let usableData = pieChartModel.transformToUsable(this.data);
      // return usableData[usableData.findIndex(item => item.setId === this.currentIndex)]
    },
    colorScale () {
      // return an ordinal color scale based on all values provided
      return d3.scaleOrdinal(this.currentData.values.map(item => item.color))
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
      // Reset the new "old" angle here for the next transition
      this.d3Local.set(nodes[index], d)
      return (t) => {
        return this.arc(i(t))
      }
    },

    draw () {
      // data format is expected to be like `@/store/static/d3-models/pieChart`

      // join
      let arcs = this.canvas.selectAll('.arc')
        .data(this.pie(this.currentData.values), wedge => wedge.data.id)

      // update
      arcs.select('path')
        .transition().duration(750).attrTween('d', this.arcTween)

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

      // arcs.exit()

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
    currentData (newData, oldData) {
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
    stroke-width: 3px;
  }
}
.vis-svg {
  max-width: 500px;
}
</style>
