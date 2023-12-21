import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import App from './App'
import Container from './components/Container'


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Container>
      <MantineProvider>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
      </Container>
    </QueryClientProvider>
  </React.StrictMode>,
)
