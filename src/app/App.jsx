import React from 'react'
import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './router/AppRouter'
import ReloadPrompt from '@/components/pwa/ReloadPrompt'

const App = ({ includeRouter = true }) => {
    return (
        <AppProviders includeRouter={includeRouter}>
            <AppRouter />
            <ReloadPrompt />
        </AppProviders>
    )
}

export default App
