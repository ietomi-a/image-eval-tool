import React from 'react';
import { useRecoilValue } from 'recoil';

import { imageDatasState, ImageDatas, Rate } from "./atoms";
import { URL_ROOT } from './constant';
import "./Ranking.css";


const RankImage = ( {imagePath, entry}: {imagePath:string, entry: Rate} ) => {
  return (
    <div className="rankImage">
      <img src={URL_ROOT+imagePath} width="200" height="200" />
      <div> &nbsp;&nbsp;win = {entry.win}, lose = {entry.lose}, rate = {entry.rate.toFixed(2)} </div>
    </div>);
};

function getSortedImagePathsByRate(datas: ImageDatas): string[] {
  const pathRates = new Array();  
  for( const fpath in datas ){
    pathRates.push({key: fpath, val: datas[fpath].rate});
  }
  pathRates.sort(
    (a,b) => { return (a.val > b.val) ? -1 : 1 ; } ) ;
  const ret = new Array();
  for( let i=0; i < pathRates.length; i++ ){
    ret.push(pathRates[i].key);
  }
  return ret;
}


export const Ranking = () => {      
  const imageDatas = useRecoilValue(imageDatasState);
  const imagePaths = getSortedImagePathsByRate(imageDatas);
  // console.log(imageDatas);
  // console.log(imagePaths);
  return (
    <ul className="ranking">
      {imagePaths.map(
        imagePath =>
        <RankImage imagePath={imagePath} entry={imageDatas[imagePath]} />)}
    </ul>
  );
};

