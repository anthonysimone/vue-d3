<template>
  <div class="pie-chart">
    <div class="vis">
      <div class="vis-svg">
        <svg viewBox="0 0 400 400"></svg>
      </div>
      <div class="vis-meta">
        <div class="select-container" v-if="this.data.length > 1">
          <span class="label">Data Set</span>
          <div class="select">
            <select class="select" v-model.number="currentIndex">
              <option v-for="set in this.data"
                :key="set.setId"
                :value="set.setId">
                {{ set.setName }}
              </option>
            </select>
          </div>
        </div>
        <div class="legend">
          <span class="label">Legend</span>
          <div class="legend-item" v-for="(group, index) in this.currentData.values" :key="index">
            <span class="color-swatch" :style="{ backgroundColor: group.color }"></span><span class="label">{{ group.label }}</span>
          </div>
        </div>
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
      tooltip: null,
      width: 400,
      height: 400,
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
    total () {
      return this.currentData.values.map(item => item.value).reduce((a, b) => +a + +b)
    },
    colorScale () {
      // return an ordinal color scale based on all values provided
      return d3.scaleOrdinal(this.currentData.values.map(item => item.color))
        .domain(this.currentData.values.map(item => item.id))
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
      // set up the tooltip container
      this.tooltip = d3.select('.vis-svg').append('div').attr('class', 'tooltip')
      this.tooltip.append('div').attr('class', 'label')
      this.tooltip.append('div').attr('class', 'count')
      this.tooltip.append('div').attr('class', 'percent')
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
        .attr('fill', d => this.colorScale(d.data.id))
        .attr('d', this.arc)
        .on('mouseover', d => {
          this.tooltip.select('.label').html(`${d.value} ${d.data.label} (${Math.floor(d.value / this.total * 100)}%)`)
          this.tooltip.style('display', 'block')
        })
        .on('mousemove', d => {
          this.tooltip.style('top', `${d3.event.offsetY - 10}px`).style('left', `${d3.event.offsetX + 15}px`)
        })
        .on('mouseout', d => {
          this.tooltip.style('display', 'none')
        })
        .each((d, i, nodes) => {
          // store the current data set on the node for access in the tween
          this.d3Local.set(nodes[i], d)
        })

      // exit
      arcs.exit()
        .remove()

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
    currentData: {
      handler (newData, oldData) {
        this.draw()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
// layout
@include tablet() {
  .vis {
    display: flex;
    align-items: center;
  }
  .vis-svg {
    position: relative;
    flex: 0 0 400px;
    .tooltip {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
    }
  }
  .vis-meta {
    flex: 1 0;
    margin-left: 30px;
  }
}
.select-container {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
}

// style
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
  .tooltip {
    background: rgba($white, 0.9);
    padding: 5px;
    border: 2px solid $dark-gray;
    border-radius: 4px;
    white-space: nowrap;
    .label {
      margin: 0;
    }
  }
}

.vis-meta {
  .legend-item {
    display: flex;
    .color-swatch {
      display: block;
      flex: 0 0 15px;
      margin: 3px 3px 3px 0;
    }
  }
}
</style>
