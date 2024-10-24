import React from 'react'
import { useRoutes } from 'react-router-dom'
import rout from './router/AppRout'

const App = () => {
  const routing = useRoutes(rout)
  return (
    <div>
      {routing}
    </div>
  )
}

export default App