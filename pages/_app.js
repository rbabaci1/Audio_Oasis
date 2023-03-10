import { Layout } from '../components';
import React from 'react';
import { StateContext } from '../context/stateContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <StateContext>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  );
}
