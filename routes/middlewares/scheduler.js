import cron from 'node-cron';

import fs from 'fs';
import fsp from 'fs/promises';
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
    makeFolder(`./uploads/images/${time.year}/${time.month}/${time.date}`);
  });
}

export function deleteImageScheduler() {
  cron.schedule('0 0 0 * * *', async () => {
    console.log('이미지 삭제 스케줄러 실행!');
    const conn = await db.getConnection();
    try {
      const imagesPath = await conn
        .execute('SELECT md.id, md.src from MEDIA as md where md.post is null or md.user is null')
        .then((res) => res[0]);
      console.log(imagesPath);

      for await (const image of imagesPath) {
        try {
          await fsp.unlink(`./uploads/images/${image.src}`);
          console.log(`[Image Scheduler] uploads/images/${image.src} 이미지가 삭제되었습니다.`);

          await conn.execute('delete from MEDIA as md where md.id = ?', [image.id]);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      conn.release();
    }
  });
}
