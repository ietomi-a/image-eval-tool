import React, {Suspense} from 'react';
import { RecoilRoot } from 'recoil';

import {ImagePair} from "./ImagePair";
import {Ranking} from "./Ranking";
import "./App.css";


export const App = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div> now loading </div>}>
        <div className="app">
          <ImagePair />
          <Ranking />
        </div>
      </Suspense>        
    </RecoilRoot>    
  );
};

export default App;
