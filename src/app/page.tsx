"use client";

import type { ReactElement } from "react";
import { type Provider } from "#/lib/configs/provider/provider.type";
import { AiOutlineClose } from "react-icons/ai";
import { domCookie } from "cookie-muncher";
import { providers, randomMessages } from "#/lib/configs/provider/provider.config";
import { Text } from "#/lib/components/atoms/text";
import { useEventListener } from "usehooks-ts";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

const Page = (): ReactElement => {
  const [search, setSearch] = useState<string>("");
  const [provider, setProvider] = useState<Provider>(providers[0]);
  const [tabDiscovered, setDiscovered] = useState<boolean>(true);
  const [selectProvider, setSelectProvider] = useState<boolean>(false);

  const question = randomMessages[Math.floor(Math.random() * randomMessages.length)];

  useEffect(() => {
    setDiscovered((domCookie.get("tab-discovered")?.value == "true" ? true : false));

    const providerCookie = domCookie.get("provider");
    if (!providerCookie) {
      domCookie.set({ name: "provider", value: providers[0].name.toLowerCase() }, {
        expires: new Date(2030, 11, 31, 23, 59, 59, 999)
      });
    } else {
      const filteredProvider = providers.find(provider => provider.icon === providerCookie.value.toLowerCase() + ".png");
      if (filteredProvider) setProvider(filteredProvider);
    }
  }, []);

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
    <>
      <div className="flex flex-col items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
        <Image src={"/simplist-light.png"} alt="Simplist logo" quality={5} width={180} height={60} />

        <div className="flex bg-[#1E293B] rounded-full p-1 mt-4 w-full max-w-2xl">
          <div className="bg-[#2B3A52] flex rounded-full p-2 ml-0.5">
            <Image
              src={"/providers/" + provider.icon}
              className={clsx(
                "grayscale cursor-pointer transition-opacity duration-300 ease-in-out",
                {
                  "hidden": selectProvider
                }
              )}
              quality={5}
              alt={provider.name}
              width={24}
              height={24}
              onClick={() => {
                setSelectProvider(!selectProvider);
              }}
            />

            {selectProvider && (
              <>
                {/* map providers but add the active one first */}
                {providers.sort((a, _) => a.name == provider.name ? -1 : 1).map((provider, index) => (
                  <Image
                    key={index}
                    src={"/providers/" + provider.icon}
                    className={clsx(
                      "grayscale cursor-pointer hover:grayscale-0 transition-all duration-300 ease-in-out", {
                        "ml-2": index != 0
                      }
                    )}
                    quality={5}
                    alt={provider.name}
                    width={24}
                    height={24}
                    onClick={() => {
                      setProvider(provider);
                      setSelectProvider(false);
                      domCookie.set({ name: "provider", value: provider.name.toLowerCase() }, {
                        expires: new Date(2030, 11, 31, 23, 59, 59, 999)
                      });
                    }}
                  />
                ))}
              </>
            )}
          </div>

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
    </>
  );
};

export default Page;