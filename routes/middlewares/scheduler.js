import cron from 'node-cron';

import fs from 'fs';
import { db } from '../../config/mysql.js';
import path from 'path';
export const makeFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();

const currentTime = new Date(year, month, day, 9);

const time = {
  year: currentTime.getFullYear(),
  month: currentTime.getMonth() + 1,
  date: currentTime.getDate(),
};
export default time;

export function makeFolderScheduler() {
  cron.schedule('0 0 0 * * *', () => {
    console.log('폴더 생성 스케줄러 실행!');
    makeFolder(`./upload/images/${time.year}/${time.month}/${time.date}`);
  });
}

// TODO 1. src 파일 찾아서 삭제,
// TODO 2. 삭제 완료 후 db에서 media row 삭제
export async function deleteImageScheduler() {
  // cron.schedule('0 0 0 * * *', async () => {
  console.log('이미지 삭제 스케줄러 실행!');
  const conn = await db.getConnection();
  try {
    const imagesPath = await conn
      .execute('SELECT md.src from MEDIA as md where md.post is null')
      .then((res) => res[0].map((el) => el.src));
    console.log(imagesPath);
  } catch (error) {
  } finally {
    conn.release();
  }
  // });
}
