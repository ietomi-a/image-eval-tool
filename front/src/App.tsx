import React, {Suspense} from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';

import {ImagePair} from "./ImagePair";
import {Ranking} from "./Ranking";
import {imageDatasState, ImageDict} from "./atoms";
import { URL_ROOT } from './constant';

import "./App.css";


const DatasetButton = (props) => {
  const setImageDatas = useSetRecoilState(imageDatasState);  
  const toDatasetType:string = props.toDatasetType;
  if(toDatasetType == "default"){
    var url = URL_ROOT + "init_datas";
  }else{
    var url = URL_ROOT + "user_init_datas";
  }
  const changeDatasetType = async (event) => {
    event.preventDefault();
    try {    
      const resBody = await fetch(url).then( res => res.json() );
      setImageDatas(resBody);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <button onClick={changeDatasetType}> to: {toDatasetType} </button>
  );
};


const AppCore = () => {
  const imageDatas = useRecoilValue(imageDatasState);
  return (
    <div className="app">
      <ImagePair />
      <h2> datasetType = {imageDatas.datasetType} </h2>
      <DatasetButton toDatasetType="default" />
      <DatasetButton toDatasetType="user_data" />
      <Ranking datas={imageDatasState} />
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
