"use client";

import { providers, randomMessages } from "#/lib/configs/provider/provider.config";
import { SearchProvider, Providers } from "#/lib/components/molecules/providers";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { useState, type ReactElement, useEffect } from "react";
import { Text } from "#/lib/components/atoms/text";
import { AiOutlineClose } from "react-icons/ai";
import { useEventListener } from "usehooks-ts";
import { domCookie } from "cookie-muncher";
import Image from "next/image";
import clsx from "clsx";

const Page = (): ReactElement => {
  const [search, setSearch] = useState<string>("");
  const [provider, setProvider] = useState<Provider>(providers[0]);
  const [tabDiscovered, setDiscovered] = useState<boolean>(true);

  useEffect(() => {
    setDiscovered((domCookie.get("tab-discovered")?.value == "true" ? true : false));
  }, []);

  const question = randomMessages[Math.floor(Math.random() * randomMessages.length)];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (search.length == 0) return;
    window.location.href = provider.url.replace("{search}", encodeURIComponent(search));
  };

  const onTabPressed = (event: KeyboardEvent): void => {
    if (event.code == "Tab") {
      if (search.length > 0) return;
      domCookie.set({ name: "tab-discovered", value: "true" });
      event.preventDefault();
      setSearch(question.question);
    }
  };

  useEventListener("keydown", onTabPressed);

  return (
    <SearchProvider.Provider value={{ provider, setProvider }}>
      <div className="flex flex-col items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/simplist-light.png"} alt="Simplist logo" quality={5} width={200} height={50} />

        <div className="flex bg-[#1E293B] rounded-full p-1 mt-4 w-full max-w-2xl">
          <Providers />

          <form className="flex flex-1" onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              autoFocus={true}
              placeholder={question.question}
              className="text-[#707F97] w-full placeholder-[#707F97] outline-none ml-2 bg-transparent"
              onChange={(e) => setSearch(e.target.value)}
            />

            {search.length > 0 && (
              <button
                type="button"
                className="flex items-center justify-center p-3"
                onClick={() => setSearch("")}
              >
                <AiOutlineClose className="text-[#707F97]" />
              </button>
            )}
          </form>
        </div>

        <div className={clsx(
          "items-center justify-center mt-4 gap-2 hidden", {
            "sm:flex": search.length == 0 && tabDiscovered == false
          }
        )}>
          <Text>Press <span className="font-bold border border-[#707F97] rounded px-1">Tab</span> to select the current suggestion</Text>
        </div>

        {/* <div className={clsx(
          "border-light border-dashed border-2 rounded p-3 mt-4 cursor-pointer hover:bg-[#1E293B]",
          "opacity-5 hover:opacity-100 transition-opacity duration-300 ease-in-out"
        )}>
          <AiFillPlusCircle className="text-light h-8 w-8" />
        </div> */}
      </div>
    </SearchProvider.Provider>
  );
};

export default Page;