import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext.tsx';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </ProductProvider>
  </StrictMode>,
)