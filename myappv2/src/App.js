import logo from './logo.svg';
import './App.css';
import {React, useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const providerUrl = process.env.PROVIDER_URL;

  useEffect(() => {
    const web3 = new Web3(providerUrl)  
  
    let provider = window.ethereum;
  
    if (typeof provider !== 'undefined') {
        //Metamask is installed
        provider
        .request({method: 'eth_requestAccounts' })
        .then((accounts) => {
          console.log("Account " + accounts);
        })
        .catch((err) => {
          console.log("Eror " + err);
        });
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      console.log("Account changed to " + accounts);
    });
  }, []);
  return <div className='App'></div>;
}

export default App;
