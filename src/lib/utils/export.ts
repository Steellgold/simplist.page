import { toPng } from "html-to-image";
import type { MutableRefObject } from "react";

export const convertPng = (ref: MutableRefObject<null>, search: string): void => {
  if (!ref.current) return;

  toPng(ref.current, { cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = search.toLocaleLowerCase().replace(" ", "-") + ".png";
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.log(err);
    });
};