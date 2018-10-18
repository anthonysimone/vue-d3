export default {
  types: [
    {
      id: 'test',
      name: 'Test Visualization',
      templateName: 'TestVisualization'
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      templateName: 'PieChart'
    },
    {
      id: 'line',
      name: 'Line Graph',
      templateName: 'LineGraph'
    },
    {
      id: 'bar',
      name: 'Bar Graph',
      templateName: 'BarGraph'
    },
    {
      id: 'bag',
      name: 'Bag Plot',
      templateName: 'BagPlot'
    }
  ],
  // types: {
  //   test: 'Test Visualization',
  //   pie: 'Pie Chart',
  //   line: 'Line Graph',
  //   bar: 'Bar Graph',
  //   bag: 'Bag Plot'
  // },
  getNameById (id) {
    return this.types.filter(type => type.id === id)[0].name
  },
  getTemplateNameById (id) {
    return this.types.filter(type => type.id === id)[0].templateName
  }
}
