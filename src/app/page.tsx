import { SearchBar } from "#/lib/components/molecules/providers/search-bar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { randomMessages } from "#/lib/configs/provider/provider.config";
import type { ReactElement } from "react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const Home = async(): Promise<ReactElement> => {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/simplist-light.png"} loading="lazy" alt="Simplist logo" quality={5} width={200} height={50} />

        <div className="flex flex-col max-w-2xl w-full">
          <SearchBar
            userId={user?.id || ""}
            connected={user !== null}
            randomQuestion={randomMessages[Math.floor(Math.random() * randomMessages.length)].question} />
        </div>

        <div className="absolute bottom-0 right-0 mb-4 mr-4">
          <Link href={"/privacy"} className="text-gray-100 hover:text-gray-300 transition-colors duration-300 ease-in-out">
            privacy policy
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;