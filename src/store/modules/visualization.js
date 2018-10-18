import Visualizations from '@/firebase/firestore/Visualizations'

const state = {
  visualizationsByUser: null
}

const getters = {
  visualizationsByUser: state => state.visualizationsByUser,
  visualizationById: state => id => state.visualizationsByUser.find(vis => vis.id === id)
}

const mutations = {
  setVisualizationsByUser: (state, visualizations) => {
    state.visualizationsByUser = visualizations
  },
  addVisualization: (state, visualization) => {
    state.visualizationsByUser.push(visualization)
  },
  setCurrentVisualization: (state, visualization) => {
    state.currentVisualization = visualization
  },
  deleteVisualization: (state, id) => {
    let index = state.visualizationsByUser.map(vis => vis.id).indexOf(id)
    state.visualizationsByUser.splice(index, 1)
  }
}

const actions = {
  setVisualizationsByUser: ({ commit, rootState }) => {
    Visualizations.getVisualizationsByUser(rootState.user.userProfile).then((querySnapshot) => {
      let result = []
      if (!querySnapshot.empty) {
        for (let doc of querySnapshot.docs) {
          result.push(Object.assign(doc.data(), { id: doc.id }))
        }
      }
      commit('setVisualizationsByUser', result)
    })
  },
  addVisualization: ({ commit }, visualization) => {
    return new Promise((resolve, reject) => {
      Visualizations.addVisualization(visualization).then((docRef) => {
        visualization.id = docRef.id
        commit('addVisualization', visualization)
        resolve(docRef.id)
      })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteVisualization: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      Visualizations.deleteVisualization(id).then(() => {
        commit('deleteVisualization', id)
        resolve(id)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // setCurrentVisualization: ({ commit }, id) => {
  //   let vis = this.visualizationsByUser.find(vis => vis.id === id)
  //   console.log(vis);
  //   // commit('setCurrentVisualization', id)
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
