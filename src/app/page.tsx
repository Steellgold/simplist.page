import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ReactElement } from "react";
import { cookies } from "next/headers";
import Image from "next/image";
import { SearchBar } from "#/lib/components/molecules/providers/search-bar";
import { randomMessages } from "#/lib/configs/provider/provider.config";

const getData = async(): Promise<{ connected: boolean }> => {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { connected: false };
  return { connected: true };
};

export default async function Index(): Promise<ReactElement> {
  const { connected } = await getData();

  return (
    <div className="flex flex-col items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
      <Image src={"/simplist-light.png"} alt="Simplist logo" quality={5} width={200} height={50} />

      <div className="flex flex-col max-w-2xl w-full">
        <SearchBar connected={connected} randomQuestion={randomMessages[Math.floor(Math.random() * randomMessages.length)].question} />
      </div>

      {/* <div className={clsx(
          "border-light border-dashed border-2 rounded p-3 mt-4 cursor-pointer hover:bg-[#1E293B]",
          "opacity-5 hover:opacity-100 transition-opacity duration-300 ease-in-out"
        )}>
          <AiFillPlusCircle className="text-light h-8 w-8" />
        </div> */}
    </div>
  );
}