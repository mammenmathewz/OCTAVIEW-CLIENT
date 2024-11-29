import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store,{persistor} from './service/redux/store.ts'
import { PersistGate } from 'redux-persist/es/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/toaster.tsx'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={<div>Loding..</div>} persistor={persistor}>
    <QueryClientProvider client={queryClient}> 
        <App />
       <Toaster/>
      </QueryClientProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
