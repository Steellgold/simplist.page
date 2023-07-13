"use client";

import type { ReactElement } from "react";
import { createContext, useContext, useState } from "react";
import { domCookie } from "cookie-muncher";
import { providers } from "#/lib/configs/provider/provider.config";
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Provider } from "#/lib/configs/provider/provider.type";

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

  const providerCookie = domCookie.get("provider");
  if (providerCookie) {
    const filteredProvider = providers.find(provider => provider.icon === providerCookie.value.toLowerCase() + ".png");
    if (filteredProvider) setProvider(filteredProvider);
  }

  return (
    <SearchProvider.Provider value={{ provider, setProvider }}>
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
            {providers.sort((a, _) => a.name == providers[0].name ? -1 : 1).map((provider, index) => (
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
    </SearchProvider.Provider>
  );
};