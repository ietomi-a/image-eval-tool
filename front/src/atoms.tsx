import { atom, selector } from 'recoil';

import {URL_ROOT} from './constant';

export interface Rate {
  win: number;
  lose: number;
  rate: number;
}

export interface ImageDatas {
  [name: string]: Rate;  
}

export interface DatasetStruct {
  datasetType: string;
  dataset: string;  
}


const defaultData = {
  datasetType: "default", dataset: "default"
};

export const datasetState = atom<DatasetStruct>({
  key: 'datasetState',
  default: defaultData
});

const imageDatasInitialize = selector<ImageDatas>({
  key: 'imageDatasInitialize',  
  get: async () => {
    const params = new URLSearchParams({
      datasetType: defaultData.datasetType,
      dataset: defaultData.dataset
    });
    
    const url = URL_ROOT + "init_datas/?" + params.toString();
    try {
      const resBody = await fetch(url).then( res => res.json() );
      return resBody;
    } catch (e) {
      console.error(e);
    }
  },
});


export const imageDatasState = atom<ImageDatas>({
  key: 'imageDatasState',
  default: imageDatasInitialize
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

export const userDatasetsState = atom({
  key: 'userDatasetsState',
  default: userDatasetsIinitalize
});


function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImagePathPair( imagePathList:string[] ):[string,string]{
  const len:number = imagePathList.length;
  const leftId = getRandomInt(0, len-1);
  let rightId = -1;
  while( (rightId === leftId) || (rightId === -1) ){
    rightId = getRandomInt(0, len-1);
  }
  const leftImagePath = imagePathList[leftId];
  const rightImagePath = imagePathList[rightId];
  return [leftImagePath, rightImagePath];
}

export const imagePairState = selector<[string,string]>({
  key: 'imagePairState',
  get: ({get}) => {
    const imageDatas = get(imageDatasState);
    const imagePair = getRandomImagePathPair( Object.keys(imageDatas) );
    return imagePair;
  },
});
