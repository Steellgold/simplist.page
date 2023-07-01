import type { ReactElement } from "react";
import { Text } from "../text";
import Image from "next/image";

export const Weather = (): ReactElement => {
  return (
    <div className="fixed top-0 left-0 h-screen p-3">
      <div className="flex">
        <div>
          <Image src={"/weather/3.png"} quality={5} width={48} height={48} alt="Weather icon" />
        </div>
        <div className="ml-3">
          <Text className="text-2xl font-semibold">20°</Text>
          <Text className="-mt-2">Cloudy</Text>
        </div>
      </div>
    </div>
  );
};