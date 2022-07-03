import {getSortedImagePathsByRate} from '../src/Ranking';

test('sort test', () => {
  const imageDatas = {
    "13.jpg": {
      win: 10,
      lose: 8,
      rate: 1503
    },
    "1.jpg": {
      win: 9,
      lose: 8,
      rate: 1510
    }
  }
  expect(getSortedImagePathsByRate(imageDatas)).toStrictEqual(["1.jpg","13.jpg"]);
});
