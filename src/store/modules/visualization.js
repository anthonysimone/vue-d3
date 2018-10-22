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
  updateVisualization: (state, { itemToUpdate, dataToUpdate }) => {
    Object.assign(itemToUpdate, dataToUpdate)
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
  updateVisualization: ({ commit, getters }, { id, dataToUpdate }) => {
    return new Promise(() => {
      Visualizations.updateVisualization(id, dataToUpdate).then(() => {
        // success, we pass the item to update as well as the updates themselves to the mutation
        commit('updateVisualization', {
          itemToUpdate: getters.visualizationById(id),
          dataToUpdate
        })
      }).catch((error) => {
        console.log('Error updating document: ', error)
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
