import { atom, selector } from 'recoil';

import {URL_ROOT} from './constant';

export interface Rate {
  win: number;
  lose: number;
  rate: number;
}

export interface ImageDict {
  [name: string]: Rate;
}


export interface ImageDatas {
  body: ImageDict;
  datasetType: string;
}


const imageDatasInitialize = selector<ImageDatas>({
  key: 'imageDatasInitialize',
  get: async () => {
    const url = URL_ROOT + "init_datas/?datasetType=default";
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
    const imageBody = imageDatas.body;
    const imagePair = getRandomImagePathPair( Object.keys(imageBody) );
    return imagePair;
  },
});
