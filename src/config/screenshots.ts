import cardImage from "../../public/img/screenshots/card-mobile.png";
import classroomImage from "../../public/img/screenshots/classroom-desktop.png";
import classroomMobile from "../../public/img/screenshots/classroom-mobile.png";
import homepageLight from "../../public/img/screenshots/homepage-light-mobile.png";
import homepageImage from "../../public/img/screenshots/homepage-mobile.png";
import libraryImage from "../../public/img/screenshots/library-mobile.png";
import networkImage from "../../public/img/screenshots/network-mobile.png";
import pigImage from "../../public/img/screenshots/pig-mobile.png";
import scheduleImage from "../../public/img/screenshots/schedule-desktop.png";
import scheduleMobile from "../../public/img/screenshots/schedule-mobile.png";
import waterImage from "../../public/img/screenshots/water-mobile.png";

// User-supplied captures, preserved without cropping or recoloring.
export const screenshotScenes = [
  {
    id: "schedule",
    title: { zh: "课程安排", en: "Weekly timetable" },
    images: [
      { type: "desktop", image: scheduleImage },
      { type: "mobile", image: scheduleMobile },
    ],
  },
  {
    id: "classroom",
    title: { zh: "空闲教室", en: "Available classrooms" },
    images: [
      { type: "desktop", image: classroomImage },
      { type: "mobile", image: classroomMobile },
    ],
  },
  {
    id: "homepage",
    title: { zh: "深色首页", en: "Dark home" },
    images: [{ type: "mobile", image: homepageImage }],
  },
  {
    id: "homepage-light",
    title: { zh: "浅色首页", en: "Light home" },
    images: [{ type: "mobile", image: homepageLight }],
  },
  {
    id: "library",
    title: { zh: "图书馆", en: "Library" },
    images: [{ type: "mobile", image: libraryImage }],
  },
  {
    id: "card",
    title: { zh: "校园卡", en: "Campus card" },
    images: [{ type: "mobile", image: cardImage }],
  },
  {
    id: "network",
    title: { zh: "校园网使用详情", en: "Campus network usage" },
    images: [{ type: "mobile", image: networkImage }],
  },
  {
    id: "water",
    title: { zh: "宿舍水机", en: "Dorm water dispensers" },
    images: [{ type: "mobile", image: waterImage }],
  },
  {
    id: "pig",
    title: { zh: "猪图鉴赏", en: "Pig gallery" },
    images: [{ type: "mobile", image: pigImage }],
  },
] as const;
