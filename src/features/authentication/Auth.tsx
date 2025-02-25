import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "../../lib/web3RPC";
import "../../assets/css/App.css";
// import { createCeramicDoc } from "../listings/createCeramicDoc";
import ResponsiveAppBar from "../../pages/Navbar/Navbar";

import { Home } from "../../pages/Home";
// import { Listings } from "../listings/Listings";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { PageNotFound } from "../../pages/PageNotFound";
import { Openmarket } from "../marketplace/open_market/Open_market";
import  Coopmarket  from "../marketplace/coop_market/Coop_market";
import  Privatemarket  from "../marketplace/private_market/Private_market";
import { ActiveListings } from "../dashboard/ActiveListings";
import { Messaging } from "../messages/Messaging";
import { Bookmarks } from "../dashboard/Bookmarks";
import { UserSettings } from "../dashboard/Settings";
import { Statistics } from "../dashboard/Statistics";
import { FileDisputes } from "../disputes/FileDisputes";
import {Dashboard} from "../dashboard/Dashboard";
import OfferForm from "../listings/OfferForm";
import { SingleOfferView } from "../listings/SingleOfferView";

const clientId: any = process.env.REACT_APP_CLIENT_ID; // get from https://dashboard.web3auth.io

function Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [ isLogged, setIsLogged ] = useState<boolean>(false);
  const [accountdata, setAccInfo] = useState<any>();

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget:
              "https://goerli.infura.io/v3/9834efc01c904696a10cb3c37c72727c", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
        const rpc = new RPC(web3auth.provider);
        setAccInfo(await rpc.getAccounts());

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setIsLogged(true);
    console.log("TEST: logged in!");
  };


  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    return user;
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setIsLogged(false);
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    return await rpc.getChainId();
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    return await rpc.getAccounts();
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    return await rpc.getBalance();
  };

  // const sendTransaction = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   return await rpc.sendTransaction();
  // };

  // const signMessage = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   return await rpc.signMessage();
  // };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    return await rpc.getPrivateKey();
  };

  if (provider) {
    return (
      <>

        <BrowserRouter>
        <div>
        <ResponsiveAppBar logged={logout} isLogged={isLogged}/>
        </div>
          <Routes>
            <Route path="fillform" element={<OfferForm accountdata={accountdata}/>} />
            <Route path="/:offerid" element={<SingleOfferView/>} />
            <Route path="/" element={<Dashboard />} >
              <Route path="openmarket" element={<Openmarket />} />
              <Route path="coopmarket" element={<Coopmarket />} />
              <Route path="privatemarket" element={<Privatemarket />} />
              <Route path="activelistings" element={<ActiveListings />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="dispute" element={<FileDisputes />} />
              <Route path="settings" element={<UserSettings getUserInfo={getUserInfo} getChainId={getChainId} getAccounts={getAccounts} getBalance={getBalance} getPrivateKey={getPrivateKey} />} />
             </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }

  return (
    <><div>
      <ResponsiveAppBar logged={login} isLogged={isLogged}/>
      </div>
      <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home logged={login}/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      </div>
    </>
  );
}

export default Auth;
