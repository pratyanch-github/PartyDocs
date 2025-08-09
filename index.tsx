import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { RepoProvider } from './context/RepoContext';
import { SidebarProvider } from './context/SidebarContext';
import { ModalProvider } from './context/ModalContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <RepoProvider>
        <SidebarProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </SidebarProvider>
      </RepoProvider>
    </HashRouter>
  </React.StrictMode>
);