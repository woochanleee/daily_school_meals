<p align="center">
    <img src="./docs/service.png" alt="서비스 사진" width="500">
  <h3 align="center">📌✨오늘의 급식</h3>
</p>

<p align="center">
   <img src="https://img.shields.io/badge/language-typescript-blue?style"/>
   <img src="https://img.shields.io/github/license/maxam2017/productive-box"/>
   <img src="https://img.shields.io/github/stars/woochanleee/daily_school_meals"/>
   <img src="https://img.shields.io/github/stars/woochanleee/daily_school_meals"/>
</p>
<p align="center">
   여러분의 오늘의 급식은 무엇인가요?
   <br/>
   오늘은 조식, 중식, 석식 중 언제가 맛있을까요?
   <br/>
   Let's check out in gist!
</p>

---

> This project is inspired by an pinned-gist.<br/>
> Find original in https://github.com/craftydragon678<br/>
> This README is made by referring to [this.](https://github.com/techinpark/productive-box/README.md)

## Overview

This project uses [@octokit/rest API](https://github.com/octokit/rest.js/)to write into the gist.  
Synchronized at 00:00 time every day.

## Setup

### Prep work

1. Create a new public GitHub Gist (https://gist.github.com/)
1. Create a token with the `gist` scope and copy it. (https://github.com/settings/tokens/new)
   > enable only `gist`<br/>

### Project setup

1. Fork this repo
1. Open the "Actions" tab of your fork and click the "enable" button
1. Create 3 Gist files.
1. Edit the [environment variable](https://github.com/maxam2017/productive-box/blob/master/.github/workflows/schedule.yml#L17-L18) in `.github/workflows/schedule.yaml`:

   - **BREAKFAST_GIST_ID:** The ID portion from your gist url, breakfast
   - **LAUNCH_GIST_ID:** The ID portion from your gist url, launch
   - **DINNER_GIST_ID:** The ID portion from your gist url, dinner
   - ex) **fcdc51abe32b2ccf38b74f7229571da2**
   - your gist site **`https://gist.github.com/woochanleee/fcdc51abe32b2ccf38b74f7229571da2`**

1. Go to the repo **Settings > Secrets**
1. Add the following environment variables:
   - **GH_TOKEN:** The GitHub token generated above.
1. [Pin the newly created Gist](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/pinning-items-to-your-profile)

## Custom Your School Meal

### Find your school code

- Open this site -> [https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN17320190722180924242823&infSeq=1](https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN17320190722180924242823&infSeq=1)
- Search Your School.
- ![](./docs/school_code.png)
- Memorize **시도교육청코드**, **표준학교코드**

### Edit `src/index.ts`

- At 15 Line ~ 18 Line.
- As you can see comment in code.
- Change value using that you memorized code at prev stage.

### Finish

If you followed well, it would have been modified to your school.
