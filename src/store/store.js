import { configureStore } from '@reduxjs/toolkit'
import appVarsReducer from './appVars'

const store = configureStore({
  	reducer: {
		appVars: appVarsReducer
	}
})

export default store;