import React, {Suspense} from 'react';
import { RecoilRoot } from 'recoil';

import {ImagePair} from "./ImagePair";
import {Ranking} from "./Ranking";
// import {Login} from "./Login";
import "./App.css";

const AppCore = () => {
  return (
    <div className="app">
      <ImagePair />
      <Ranking />
    </div>
  );
};


export const App = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div> now loading </div>}>
        <AppCore />
      </Suspense>        
    </RecoilRoot>    
  );
};

export default App;
