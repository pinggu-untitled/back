import cron from 'node-cron';

import fs from 'fs';
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
