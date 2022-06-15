import React, {Suspense, useState} from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot, atom, useRecoilState, useSetRecoilState, useRecoilValue, selector } from 'recoil';

import {Ranking} from "./Ranking";
import { URL_ROOT } from './constant';
import {imageDatasState, ImageDatas} from "./atoms";

const initGetParams = new URLSearchParams({
  datasetType: 'user_data'
});    


const userImageDatasInitialize = selector<ImageDatas>({
  key: 'userImageDatasInitialize',
  get: async () => {
    const url = URL_ROOT + "init_datas/?" + initGetParams.toString();
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
  default: userImageDatasInitialize,
});



const userDatasetsIinitalize = selector({
  key: 'userDatasetsInitialize',
  get: async () => {
    const url = URL_ROOT + "user_dataset";
    console.log(url);
    try {
      const resBody = await fetch(url).then( res => res.json() );
      return resBody;
    } catch (e) {
      console.error(e);
    }
  },
});

const userDatasetsState = atom({
  key: 'userDatasetsState',
  default: userDatasetsIinitalize
});


const currentDatasetState = atom({
  key: 'currentDatasetState',
  default: "default"
});


const ChangeDatasetButton = (props) => {
  const setCurrentDataset = useSetRecoilState(currentDatasetState);
  const setUserImageDatas = useSetRecoilState(userImageDatasState);  
  const changeDataset = async (event) => {
    event.preventDefault();
    setCurrentDataset(props.dataset);
    const initUploadGetParams = new URLSearchParams({
      datasetType: 'user_data',
      dataset: props.dataset
    });
    try {    
      const url = URL_ROOT + "init_datas/?" + initUploadGetParams.toString();
      const resBody = await fetch(url).then( res => res.json() );
		  // console.log('upload body:', resBody);      
      setUserImageDatas( resBody );      
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

const DatasetForm = () => {
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
    formData.append("dataset", currentDataset);
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
      const initUploadGetParams = new URLSearchParams({
        datasetType: 'user_data',
        dataset: currentDataset
      });    
      const url = URL_ROOT + "init_datas/?" + initUploadGetParams.toString();
      const resBody = await fetch(url).then( res => res.json() );
		  console.log('upload body:', resBody);
      setUserImageDatas( resBody );
    } catch (e) {
      console.error(e);
    }

  };

  return (
    <div>
      <h2> currentDataset = {currentDataset} </h2>
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
