import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './redux/store';
import { router } from './routes';
import './styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

export default App;