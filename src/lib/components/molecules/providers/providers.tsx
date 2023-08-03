"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { providers } from "#/lib/configs/provider/provider.config";
import type { ReactElement } from "react";
import Image from "next/image";
import React from "react";
import clsx from "clsx";
import { useLocalStorage } from "usehooks-ts";

type ProviderProps = {
  provider: Provider;
  setProvider: (value: Provider) => void;
};

export const SearchProvider = createContext<ProviderProps>({
  provider: providers[0],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setProvider: () => {}
});

export const Providers = (): ReactElement => {
  const { provider, setProvider } = useContext(SearchProvider);
  const [selectProvider, setSelectProvider] = useState<boolean>(false);
  const [_, setAlreadyVisited] = useLocalStorage("alreadyVisited", false);
  const [searchProvider, setSearchProvider] = useLocalStorage<Provider>("provider", providers[0]);

  useEffect(() => {
    setProvider(searchProvider);
  });

  return (
    <>
      <SearchProvider.Provider value={{ provider, setProvider }}>
        <div
          className="bg-[#2B3A52] flex rounded-full p-2 ml-0.5"
          onClick={() => {
            setAlreadyVisited(true);
            setSelectProvider(!selectProvider);
          }}>

          <Image
            src={"/providers/" + provider.icon}
            className={clsx(
              "grayscale cursor-pointer duration-300 ease-in-out hover:grayscale-0", {
                "hidden": selectProvider
              }
            )}
            loading="lazy"
            alt={provider.name}
            width={24}
            height={24}
          />

          {selectProvider && (
            <>
              {providers.sort((a, _) => a.name == provider.name ? -1 : 1).map((provider, index) => (
                <Image
                  key={index}
                  src={"/providers/" + provider.icon}
                  className={clsx(
                    "grayscale cursor-pointer hover:grayscale-0 transition-all duration-300 ease-in-out", {
                      "ml-2": index != 0
                    }
                  )}
                  loading="lazy"
                  alt={provider.name}
                  width={24}
                  height={24}
                  onClick={() => {
                    setProvider(provider);
                    setSearchProvider(provider);
                    setSelectProvider(false);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </SearchProvider.Provider>
    </>
  );
};