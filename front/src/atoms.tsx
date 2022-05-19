import { atom, selector } from 'recoil';

import {URL_ROOT} from './constant';

const imageDatasInitialize = selector({
  key: 'imageDatasInitialize',
  get: async ({get}) => {
      const url = URL_ROOT + "init_datas";
      try {
  	    const resBody = await fetch(url).then( res => res.json() );
  	    // console.log("in useInitState,", res_body);
        return resBody;
      } catch (e) {
  	    console.error(e);
      }
  },
});


export const imageDatasState = atom({
  key: 'imageDatasState',
  default: imageDatasInitialize,
});


function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomImagePathPair( imagePathList:any ){
  let len:number = imagePathList.length;
  const leftId = getRandomInt(0, len-1);
  let rightId = -1;
  while( (rightId === leftId) || (rightId === -1) ){
    rightId = getRandomInt(0, len-1);
  }
  const leftImagePath = imagePathList[leftId];
  const rightImagePath = imagePathList[rightId];
  return [leftImagePath, rightImagePath];
}

export const imagePairState = selector({
  key: 'imagePairState',
  get: ({get}) => {
    const imageDatas = get(imageDatasState);
    const imagePair = getRandomImagePathPair( Object.keys(imageDatas) );
    return imagePair;
  },
});
