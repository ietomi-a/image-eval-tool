import React, {Suspense, useState} from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot, atom, useRecoilState, useSetRecoilState, useRecoilValue, selector } from 'recoil';
import Cookies from "js-cookie";

import { AppLinkHeader } from './header';
import {Ranking} from "./Ranking";
import { URL_ROOT } from './constant';
import {imageDatasState, ImageDatas, userDatasetsState, DatasetStruct} from "./atoms";

const defaultData: DatasetStruct = {
  datasetType: "user_data", dataset:"default"
};

const currentDatasetState = atom<DatasetStruct>({
  key: 'currentDatasetState',
  default: defaultData
});


const userImageDatasInitialize = selector<ImageDatas>({
  key: 'userImageDatasInitialize',
  get: async () => {
    const params = new URLSearchParams({
      datasetType: defaultData.datasetType,
      dataset: defaultData.datasetType
    });    
    const url = URL_ROOT + "init_datas/?" + params.toString();
    console.log(url);
    try {
      const resBody = await fetch(url).then( res => res.json() );
      return resBody;
    } catch (e) {
      console.error(e);
    }
  },
});

const userImageDatasState = atom<ImageDatas>({
  key: 'userImageDatasState',
  default: userImageDatasInitialize
});



const ChangeDatasetButton = (props) => {
  const setCurrentDataset = useSetRecoilState(currentDatasetState);
  const setUserImageDatas = useSetRecoilState(userImageDatasState);  
  const changeDataset = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams({
      datasetType: 'user_data',
      dataset: props.dataset
    });
    const url = URL_ROOT + "init_datas/?" + params.toString();
    try {    
      const resBody = await fetch(url).then( res => res.json() );
		  // console.log('upload body:', resBody);      
      setUserImageDatas( resBody );
      setCurrentDataset( { datasetType: "user_data", dataset: props.dataset} );      
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <button onClick={changeDataset}> {props.dataset} </button>
  );
};

const DatasetList = (props) => {
  return (
      <ul className="datasetList">
        {props.datasets.map( dataset => <ChangeDatasetButton dataset={dataset} /> ) }
      </ul>
  );
};

export const DatasetForm = () => {
  const inputDatasetRef:any = React.createRef<HTMLInputElement>();
  const [userDatasets, setUserDatasets] = useRecoilState(userDatasetsState);
  const submitHandler = async (event) => {
    event.preventDefault();
    setUserDatasets(
      [...userDatasets, inputDatasetRef.current.value]
    );
  };
  return (
    <form onSubmit={submitHandler}> 
      <input ref={inputDatasetRef} type="txt" name="dataset" placeholder="" />
      <button type="submit" className="btn btn-primary"> new dataset </button>
    </form>
  );
};

export const UploadCore = () => {
  const username = Cookies.get("username");  
  const userDatasets = useRecoilValue(userDatasetsState);
  const currentDataset = useRecoilValue(currentDatasetState);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
	const [isSelected, setIsSelected] = useState(false);
  const [userImageDatas, setUserImageDatas] = useRecoilState(userImageDatasState);
  
  const changeHandler = (event) => {
    event.preventDefault();
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};
  
  const fileUpload = async () => {
    const formData: any = new FormData();
    formData.append("file", selectedFile);
    formData.append("dataset", currentDataset.dataset);
    //const body:any = { file: selectedFile };
    const data = {
			method: 'POST',
      // headers を下手に書くと Content-Type において boundary が設定されないので、書かないことにした。
      // headers: {
      //   'accept': "application/json",
      //   'Content-Type': "multipart/form-data"
      // },
			body: formData
		};

    try {
		  const result = await fetch( URL_ROOT + 'upload', data ).then( res => res.json() );
		  console.log('upload:', result);
      // if( result != "ok"){ return; }
      const params = new URLSearchParams({
        datasetType: currentDataset.datasetType,
        dataset: currentDataset.dataset
      });    
      const url = URL_ROOT + "init_datas/?" + params.toString();
      const resBody = await fetch(url).then( res => res.json() );
		  console.log('upload body:', resBody);
      setUserImageDatas( resBody );
    } catch (e) {
      console.error(e);
    }

  };

  return (
    <div>
      <AppLinkHeader />      
      <h2> username: {username} </h2>      
      <h2> currentDataset: {currentDataset.dataset} </h2>
      <DatasetForm />
      <DatasetList datasets={userDatasets} />
      <input type="file" accept="image/jpeg" name="file" onChange={changeHandler} />
	    {isSelected
       ? (
				 <div>
					 <p>Filename: {selectedFile?.name}</p>
					 <p>Filetype: {selectedFile?.type}</p>
					 <p>Size in bytes: {selectedFile?.size}</p>
				 </div>
			 ) : (
				<p>Select a file to show details</p>
			)}      
      <button onClick={fileUpload}>ファイルアップロード </button>
    </div>
  );    
};

export const Upload = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div> now loading </div>}>
        <UploadCore />
        <Ranking datas={userImageDatasState} /> 
      </Suspense>        
    </RecoilRoot>    
  );
};



function render() {
  ReactDOM.render(
    <Upload />,
    document.getElementById('root')
  );
}

render();
