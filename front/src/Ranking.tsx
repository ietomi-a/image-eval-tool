import React from 'react';
import { useRecoilValue } from 'recoil';

import { imageDatasState } from "./atoms";
import { URL_ROOT } from './constant';
import "./Ranking.css";

const RankImage = ( {imagePath, entry} ) => {
  return (
    <div>
      <img src={URL_ROOT+imagePath} width="200" height="200" />
      <div> rate = {entry.rate}, </div>
      <div> win = {entry.win},</div>
      <div> lose = {entry.lose}</div>       
    </div>);
};

function getSortedImagePathsByRate(rates){
  var aSIN = new Array();
  for( let fpath in rates ){
    aSIN.push({key:fpath, val:rates[fpath].rate});
  }
  aSIN.sort(
    (a,b) => { return (a.val > b.val) ? -1 : 1 ; } ) ;
  //console.log(aSIN);
  var bTest = new Array();
  for( let i=0; i < aSIN.length; i++ ){
    bTest.push(aSIN[i].key);
  }
  return bTest;
}


export const Ranking = () => {      
  const imageDatas = useRecoilValue(imageDatasState);
  let imagePaths = getSortedImagePathsByRate(imageDatas);
  // console.log(imagePaths);
  return (<div>
            ranking
            <ul className="ranking">
              {imagePaths.map(
                imagePath =>
                  <RankImage imagePath={imagePath} entry={imageDatas[imagePath]} />)}
            </ul>
          </div>
         );
};

