import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const {
  GH_TOKEN,
  BREAKFAST_GIST_ID,
  LAUNCH_GIST_ID,
  DINNER_GIST_ID,
} = process.env;

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

const octokit = new Octokit({
  auth: GH_TOKEN,
});

enum Meal {
  '아침' = 0,
  '점심' = 1,
  '저녁' = 2,
}

const gistOfMeal = [BREAKFAST_GIST_ID, LAUNCH_GIST_ID, DINNER_GIST_ID];

async function getMeal() {
  const data = await fetch(
    `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=ecabe857ea114a09a0db1163ae5fa947&Type=JSON&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${MLSV_YMD}`
  );
  const { mealServiceDietInfo } = await data.json();
  const menuRegExp = /(?<menu>[가-힣]+[/]*[가-힣]+(?=[\d.]*[<br\/>]*))/g;
  const result = ['', '', ''];

  for (let i = 0; i < 3; i++) {
    let match;

    if (!mealServiceDietInfo[1].row[i]) {
      result[i] += '급식이 없어연';
      break;
    }

    const MAX_ONE_LINE_LENGTH = 39;
    let count = 0;

    while ((match = menuRegExp.exec(mealServiceDietInfo[1].row[i].DDISH_NM))) {
      if (
        (result[i] + match.groups.menu).length + count >
        (count + 1) * MAX_ONE_LINE_LENGTH
      ) {
        result[i] += '\n';
        count++;
      } else if (match.index !== 0) {
        result[i] += '/';
      }
      result[i] += match.groups.menu.replace('/', '&');
    }
  }
  return result;
}

async function getGist(gistId: string) {
  try {
    const {
      data: { files },
    } = await octokit.gists.get({
      gist_id: gistId,
    });
    const fileName: string = Object.keys(files)[0];
    return fileName;
  } catch (e) {
    console.error(`Not found gist\n${e}`);
    throw e;
  }
}

interface UpdateGistOption {
  gistId: string;
  fileName: string;
  newFileName: string;
  content: string;
}

async function updateGist({
  gistId,
  fileName,
  newFileName,
  content,
}: UpdateGistOption) {
  try {
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [fileName]: {
          filename: newFileName,
          content,
        },
      },
    });
  } catch (e) {
    console.error(`Unable to update gist\n${e}`);
    throw e;
  }
}

(async () => {
  try {
    const result = await getMeal();

    result.forEach(async (content, index) => {
      const fileName = await getGist(gistOfMeal[index]);
      await updateGist({
        gistId: gistOfMeal[index],
        fileName,
        newFileName: Meal[index] + ' 🍚',
        content,
      });
    });
  } catch (e) {
    console.error(`Error main \n${e}`);
    throw e;
  }
})();
