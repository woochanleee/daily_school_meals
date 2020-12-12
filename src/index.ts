import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

const { GH_TOKEN, GIST_ID } = process.env;

const getFormatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return [year, month, day].join('');
};

// 시도교육청코드 ex) 대전: G10
const ATPT_OFCDC_SC_CODE = 'G10';

// 표준학교코드 ex) 대덕소프트웨어마이스터고등학교: 7430310
const SD_SCHUL_CODE = '7430310';

// 급식일자
const MLSV_YMD = getFormatDate(new Date());

(async () => {
  const octokit = new Octokit({
    auth: GH_TOKEN,
  });

  try {
    const {
      data: { files },
    } = await octokit.gists.get({
      gist_id: 'fcdc51abe32b2ccf38b74f7229571da2',
    });
    const fileName: string = Object.keys(files)[0];
    const data = await fetch(
      `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=ecabe857ea114a09a0db1163ae5fa947&Type=JSON&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${MLSV_YMD}`
    );
    const { mealServiceDietInfo } = await data.json();
    const menuRegExp = /(?<menu>[가-힣]+[/]*[가-힣]+(?=[\d.]+[<br\/>]*))/g;
    const result = ['', '', ''];

    enum Meal {
      '아침' = 0,
      '점심' = 1,
      '저녁' = 2,
    }

    for (let i = 0; i < 3; i++) {
      let match;

      result[i] += `${Meal[i]} - `;

      if (!mealServiceDietInfo[1].row[i]) {
        result[i] += '급식이 없어연';
        break;
      }

      while (
        (match = menuRegExp.exec(mealServiceDietInfo[1].row[i].DDISH_NM))
      ) {
        result[i] += match.groups.menu + ', ';
      }
    }

    await octokit.gists.update({
      gist_id: GIST_ID,
      files: {
        [fileName]: {
          filename: '오늘의 급식 🍚',
          content: result.join('\n'),
        },
      },
    });
  } catch (e) {
    console.error(`Unable to update gist\n${e}`);
    throw e;
  }
})();
