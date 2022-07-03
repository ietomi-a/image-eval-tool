import React, {Suspense} from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import Cookies from "js-cookie";


import { AppLinkHeader } from './header';
import {ImagePair} from "./ImagePair";
import {Ranking} from "./Ranking";
import {imageDatasState, datasetState, userDatasetsState} from "./atoms";
import { URL_ROOT } from './constant';

import "./App.css";


const DefaultDatasetButton = () => {
  const setDataset = useSetRecoilState(datasetState);  
  const setImageDatas = useSetRecoilState(imageDatasState);

  const params = new URLSearchParams({
    datasetType: 'default',
    dataset: "default"
  });
  const url = URL_ROOT + "init_datas/?" + params.toString();  
  const changeDataset = async (event) => {
    event.preventDefault();
    try {    
      const resBody = await fetch(url).then( res => res.json() );
      setImageDatas(resBody);
      setDataset({ datasetType: "default", dataset: "default" });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <button onClick={changeDataset}> default:default </button>
  );
};


const ChangeDatasetButton = (props) => {
  const setDataset = useSetRecoilState(datasetState);
  const setImageDatas = useSetRecoilState(imageDatasState);
  const changeDataset = async (event) => {
    event.preventDefault();
    setDataset( { datasetType: "user_data", dataset: props.dataset} );
    const params = new URLSearchParams({
      datasetType: 'user_data',
      dataset: props.dataset
    });
    const url = URL_ROOT + "init_datas/?" + params.toString();
    try {    
      const resBody = await fetch(url).then(res => res.json());
		  // console.log('upload body:', resBody);      
      setImageDatas( resBody );
      setDataset({ datasetType: "user_data", dataset: props.dataset });      
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <button onClick={changeDataset}> user_data:{props.dataset} </button>
  );
};

const DatasetList = (props) => {
  return (
    <ul className="datasetList">
      <DefaultDatasetButton />      
      {props.datasets.map( dataset => <ChangeDatasetButton dataset={dataset} /> ) }
    </ul>
  );
};


const FixHeader = () => {
  const username = Cookies.get("username");
  const dataset = useRecoilValue(datasetState);
  const userDatasets = useRecoilValue(userDatasetsState);
  return (
    <div id="fixHeader">
      <AppLinkHeader />
      <h2> username: {username} </h2>
      <h2> dataset: {dataset.dataset}, datasetType: {dataset.datasetType} </h2>      
      <DatasetList datasets={userDatasets} />      
      <ImagePair />
    </div>    
  );
};


const AppCore = () => {
  return (
    <div className="app">      
      <FixHeader />
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
