"use client";

import type { ReactElement } from "react";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { CiSettings } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { domCookie } from "cookie-muncher";
import { providers } from "#/lib/configs/provider/provider.config";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Page = (): ReactElement => {
  const [search, setSearch] = useState<string>("");

  let provider: Provider = providers[0];
  const providerCookie = domCookie.get("provider");
  if (!providerCookie) {
    domCookie.set({ name: "provider", value: providers[0].name });
  } else {
    const filteredProvider = providers.find(provider => provider.icon === providerCookie.value.toLowerCase() + ".png");
    if (filteredProvider) {
      provider = filteredProvider;
    } else {
      provider = providers[0];
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (search.length > 0) window.location.href = `${provider.url}${search}`;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/simplist-light.png"} alt="Simplist logo" quality={5} width={180} height={180} />

        <div className="flex bg-[#1E293B] rounded-full p-1 mt-4 w-full max-w-2xl">
          <div className="bg-[#2B3A52] flex rounded-full p-2 ml-0.5">
            <Image
              src={"/providers/" + provider.icon}
              className="grayscale"
              quality={5}
              alt={provider.name}
              width={24}
              height={24}
            />
          </div>

          <form className="flex flex-1" onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              autoFocus={true}
              placeholder="Combien y a t&apos;il d&apos;humains sur Terre ?"
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
      </div>

      <div className="fixed bottom-0 right-0 p-3">
        <Link href="/settings" className="text-[#707F97]">
          <CiSettings className="h-8 w-8 hover:animate-spin" />
        </Link>
      </div>
    </>
  );
};

export default Page;