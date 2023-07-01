"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import useTheme from "#/lib/hooks/theme/theme.hook";
import { Weather } from "#/lib/components/atoms/weather";

const Page = (): ReactElement => {
  const { theme, getImageFromTheme } = useTheme();

  return (
    <>
      <Weather />

      <div className="flex flex-col items-center justify-center mt-20 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/" + getImageFromTheme(theme)} alt="Simplist logo" width={180} height={180} />
      </div>
    </>
  );
};

export default Page;