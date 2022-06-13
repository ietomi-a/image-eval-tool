import { useRecoilState, useRecoilValue } from 'recoil';

import { imageDatasState, ImageDict } from "./atoms";
import { URL_ROOT } from './constant';


export interface ImageProps {
  imageSrc: string;
  otherSrc: string;
  ownRate: number;
  otherRate: number;
}

interface pathRate {
  fname: string;
  rate: number;
}


function getNewImageBody(imageBody: ImageDict, win: pathRate, lose: pathRate): ImageDict {
  const ret = {};
  for( const imagePath in imageBody ){
    ret[imagePath] = imageBody[imagePath];
  }
  ret[win.fname].win += 1;
  ret[win.fname].rate = win.rate;
  ret[lose.fname].lose += 1;
  ret[lose.fname].rate = lose.rate;
  return ret;
}


export const useRateUpdate = (props: ImageProps) => {
  const [imageDatas, setImageDatas] = useRecoilState(imageDatasState);
  const url = URL_ROOT + "rating";
  const body = {
    datasetType: imageDatas.datasetType,
    win: { fname: props.imageSrc, rate: props.ownRate }, 
    lose: { fname: props.otherSrc, rate: props.otherRate },
  }
  const data = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  const rateUpdate = async () => {
    try {
      const resBody = await fetch(url, data).then( res => res.json() );
      // console.log(resBody);
      const newImageBody = getNewImageBody(imageDatas.body, resBody.win, resBody.lose);
      // console.log(newImages);
      setImageDatas({body: newImageBody, datasetType: imageDatas.datasetType} );
    } catch (e) {
      console.error(e);   
    }
  };

  return rateUpdate;
};
