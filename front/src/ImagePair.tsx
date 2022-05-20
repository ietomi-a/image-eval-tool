import React from 'react';
import { useRecoilValue } from 'recoil';

import { URL_ROOT } from './constant';
import { useRateUpdate, ImageProps } from './useRateUpdate';
import { imageDatasState, imagePairState } from "./atoms";
import "./ImagePair.css";


const Image = (props: ImageProps) => {
  const rateUpdate = useRateUpdate(props);
  return (
    <div>
      <img src={URL_ROOT+props.imageSrc} width="150" height="200" />
      <button onClick={ () => { rateUpdate(); } }>
        select
      </button>
    </div>
  );
};


export const ImagePair = () => {
  const imageDatas = useRecoilValue(imageDatasState);
  const [left, right] = useRecoilValue(imagePairState);
  return (<div className="imagePair">
            &nbsp;&nbsp;choose better.
            <table>
              <tr>
                <td>
                  <Image imageSrc={left}
                         otherSrc={right}
                         ownRate={imageDatas[left].rate}
                         otherRate={imageDatas[right].rate} />
                </td>
                <td>
                  <Image imageSrc={right}
                         otherSrc={left}
                         ownRate={imageDatas[right].rate}
                         otherRate={imageDatas[left].rate} />
                </td>
              </tr>
            </table>
          </div>);
};

