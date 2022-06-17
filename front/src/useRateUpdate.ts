import { useRecoilState, useRecoilValue } from 'recoil';

import { imageDatasState, datasetState, ImageDatas } from "./atoms";
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


function getNewImageBody(imageBody: ImageDatas, win: pathRate, lose: pathRate): ImageDatas {
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

// hook なのでコンポーネントの頭で宣言する必要がある.
export const useRateUpdate = (props: ImageProps) => {
  const [imageDatas, setImageDatas] = useRecoilState(imageDatasState);
  const dataset = useRecoilValue(datasetState);
  const url = URL_ROOT + "rating";
  const body = {
    datasetType: dataset.datasetType,
    dataset: dataset.dataset,
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
      const newImageDatas = getNewImageBody(imageDatas, resBody.win, resBody.lose);
      // console.log(newImages);
      setImageDatas(newImageDatas);
    } catch (e) {
      console.error(e);   
    }
  };

  return rateUpdate;
};
