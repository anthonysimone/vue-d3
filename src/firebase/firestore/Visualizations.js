import { db } from '@/firebase/firestore/index'

export default {
  visualizations: db.collection('visualizations'),
  getVisualizationsByUser (userProfile) {
    return this.visualizations.where('createdBy', '==', userProfile.id).get()
  },
  addVisualization (visualization) {
    return this.visualizations.add(visualization)
  },
  deleteVisualization (id) {
    return this.visualizations.doc(id).delete()
  }
}
