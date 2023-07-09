"use client";

import type { ReactElement } from "react";
import { Text } from "#/lib/components/atoms/text";
import { domCookie } from "cookie-muncher";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { providers } from "#/lib/configs/provider/provider.config";

const Page = (): ReactElement => {
  const handleProvider = (name: string): void => {
    domCookie.set({ name: "provider", value: name.toLowerCase() }, {
      expires: new Date(2030, 11, 31, 23, 59, 59, 999)
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3 items-center justify-center mt-32 md:mt-0 px-3 md:px-0 md:h-screen">
        <Text className="mb-2">Click on a provider to set it as your default search engine.</Text>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider, i) => (
            <Image
              key={i}
              src={`/providers/${provider.icon}`}
              className="grayscale-0 hover:grayscale transition-all cursor-pointer"
              alt={provider.name}
              width={50}
              height={50}
              onClick={() => handleProvider(provider.name)}
            />
          ))}
        </div>
        <Link href="/" className="bg-blue-300 hover:bg-blue-400 transition-all rounded-full px-3 py-2 mt-3">
          <Text className="text-white">Back</Text>
        </Link>
      </div>
    </>
  );
};

export default Page;