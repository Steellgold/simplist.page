import type { ReactElement } from "react";
import { Weather } from "#/lib/components/atoms/weather";
import Image from "next/image";

const Page = (): ReactElement => {
  return (
    <>
      <Weather />

      <div className="flex flex-col items-center justify-center mt-20 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/simplist-light.png"} alt="Simplist logo" quality={5} width={180} height={180} />

        <div className="flex bg-[#1E293B] rounded-full p-1 mt-4 w-full max-w-2xl">
          <div className="bg-[#2B3A52] flex rounded-full p-2 ml-0.5">
            <Image src={"/providers/google.png"} className="grayscale" quality={5} alt="Googles" width={24} height={24} />
          </div>

          <form className="flex flex-1">
            <input
              autoFocus={true}
              type="text"
              placeholder="Combien y a t&apos;il d&apos;humains sur Terre ?"
              className="text-[#707F97] w-full placeholder-[#707F97] outline-none ml-2 bg-transparent"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;