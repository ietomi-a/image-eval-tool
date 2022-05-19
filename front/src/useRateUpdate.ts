import { useRecoilState } from 'recoil';

import { imageDatasState, ImageDatas } from "./atoms";
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


function getNewImageDatas(imageDatas: ImageDatas, win: pathRate, lose: pathRate): ImageDatas {
  const ret = {};
  for( const imagePath in imageDatas ){
    ret[imagePath] = imageDatas[imagePath];
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
    win: { fname: props.imageSrc, rate: props.ownRate }, 
    lose: { fname: props.otherSrc, rate: props.otherRate },
  }
  const data = {
    method: 'POST',
    body: JSON.stringify(body),
  };
  const rateUpdate = async () => {
    try {
      const resBody = await fetch(url, data).then( res => res.json() );
      // console.log(resBody);
      const newImageDatas = getNewImageDatas(imageDatas, resBody.win, resBody.lose);
      // console.log(newImages);
      setImageDatas(newImageDatas);
    } catch (e) {
      console.error(e);   
    }
  };

  return rateUpdate;
};
