export default {
  initData: [],
  storedData: [
    {
      label: 'Apples',
      id: 'apple',
      color: 'red',
      values: [
        {
          setName: 'First Set',
          setId: 1,
          value: 29
        },
        {
          setName: 'Second Set',
          setId: 2,
          value: 83
        }
      ]
    },
    {
      label: 'Oranges',
      id: 'orange',
      color: 'orange',
      values: [
        {
          setName: 'First Set',
          setId: 1,
          value: 52
        },
        {
          setName: 'Second Set',
          setId: 2,
          value: 86
        }
      ]
    },
    {
      label: 'Blueberries',
      id: 'blueberry',
      color: 'blue',
      values: [
        {
          setName: 'First Set',
          setId: 1,
          value: 112
        },
        {
          setName: 'Second Set',
          setId: 2,
          value: 38
        }
      ]
    }
    // ...
  ],
  usableData: [
    {
      setId: 1,
      setName: 'First Set',
      values: [
        {
          label: 'Apples',
          id: 'apple',
          color: 'red',
          value: 29
        },
        {
          label: 'Oranges',
          id: 'orange',
          color: 'orange',
          value: 52
        },
        {
          label: 'Blueberries',
          id: 'blueberry',
          color: 'blue',
          value: 112
        }
      ]
    },
    {
      setId: 2,
      setName: 'Second Set',
      values: [
        {
          label: 'Apples',
          id: 'apple',
          color: 'red',
          value: 83
        },
        {
          label: 'Oranges',
          id: 'orange',
          color: 'orange',
          value: 86
        },
        {
          label: 'Blueberries',
          id: 'blueberry',
          color: 'blue',
          value: 38
        }
      ]
    }
    // ...
  ],
  transformToUsable (data) {
    let dataTransform = []

    data.forEach((group, i) => {
      group.values.forEach((set, i) => {
        if (dataTransform.filter(item => item.setId === set.setId).length === 0) {
          dataTransform.push({
            setId: set.setId,
            setName: set.setName,
            values: [
              {
                label: group.label,
                id: group.id,
                color: group.color,
                value: set.value
              }
            ]
          })
        } else {
          let index = dataTransform.findIndex(item => item.setId === set.setId)

          dataTransform[index].values.push({
            label: group.label,
            id: group.id,
            color: group.color,
            value: set.value
          })
        }
      })
    })

    // Add totals and percentages per set
    dataTransform.forEach((set) => {
      set.total = set.values.map(item => item.value).reduce((a, b) => a + b)
      set.values.forEach((d) => {
        d.percentage = Math.floor(d.value / set.total * 100)
      })
    })

    return dataTransform
  },
  transformToStorable (data) {
    // let dataTransform = []
  }
}
