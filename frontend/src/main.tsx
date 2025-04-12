import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductProvider } from './context/ProductContext';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductProvider>
      <App />
    </ProductProvider>
  </StrictMode>,
)