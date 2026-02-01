import React from 'react'
import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './router/AppRouter'

const App = ({ includeRouter = true }) => {
    return (
        <AppProviders includeRouter={includeRouter}>
            <AppRouter />
        </AppProviders>
    )
}

export default App
