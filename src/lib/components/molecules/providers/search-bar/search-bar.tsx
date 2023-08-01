"use client";

import { providers, randomMessages } from "#/lib/configs/provider/provider.config";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { useCopyToClipboard, useEventListener } from "usehooks-ts";
import { TbCopy, TbRefresh, TbTrash } from "react-icons/tb";
import { Providers, SearchProvider } from "../providers";
import type { Component } from "#/lib/utils/component";
import { Text } from "#/lib/components/atoms/text";
import { AiOutlineClose } from "react-icons/ai";
import { domCookie } from "cookie-muncher";
import { MdImage } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { useRef, useState } from "react";
import clsx from "clsx";
import { exportComponentAsPNG } from "react-component-export-image";

export const SearchBar: Component<{ connected?: boolean }> = () =>  {
  const [search, setSearch] = useState<string>("");
  const [provider, setProvider] = useState<Provider>(providers[0]);
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
  const [openAIFetching, setOpenAIFetching] = useState<boolean>(false);
  const [openAIRefetching, setOpenAIRefetching] = useState<boolean>(false);
  const [_, setValue] = useCopyToClipboard();

  const question = randomMessages[Math.floor(Math.random() * randomMessages.length)];

  const handleSearch = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (search.length == 0 || search.trim().length === 0) return;
    if (provider.name !== "GPT") {
      window.location.href = provider.url.replace("{search}", encodeURIComponent(search));
      return;
    }

    if (provider.name == "GPT") {
      setOpenAIFetching(true);
      setOpenAIResponse("null");

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ search })
      });

      const r = await response.text().then(text => text.slice(1, -1));
      setOpenAIResponse(r);
      setOpenAIFetching(false);
    }
  };

  const reSearch = async(): Promise<void> => {
    if (search.length == 0 || search.trim().length === 0) return;

    if (provider.name == "GPT") {
      setOpenAIFetching(true);
      setOpenAIResponse("null");

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ search })
      });

      const r = await response.text().then(text => text.slice(1, -1));
      setOpenAIResponse(r);
      setOpenAIFetching(false);
    }
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

  const containerRef = useRef();

  return (
    <>
      <Toaster position="top-right" expand toastOptions={{
        style: {
          backgroundColor: "#1F2937",
          color: "#fff",
          border: "1px solid #4B5563"
        }
      }} />

      <SearchProvider.Provider value={{ provider, setProvider }}>
        <div className={clsx(
          "flex flex-col bg-[#1E293B] p-1 rounded-full mt-4 w-full max-w-2xl", {
            "p-3 rounded-md": provider.name == "GPT" && openAIResponse != null
          }
        )} ref={containerRef}>
          <div className="flex items-center justify-between">
            <Providers />

            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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

          <div>
            {provider.name == "GPT" && openAIResponse && (
              <div className="mt-4 gap-2 text-[#707F97] border border-[#707F97] rounded p-2 bg-[#1E293B]">
                {openAIFetching && (
                  <>
                    {openAIRefetching && <Text>Sam is thinking to an better answer...</Text>}
                    {!openAIRefetching && <Text>Sam is thinking</Text>}
                  </>
                )}
                {!openAIFetching && <Text className="leading-loose"><strong>Sam:</strong>&nbsp;{openAIResponse}</Text>}

                {!openAIFetching && (
                  <div className="flex items-center justify-end mt-2 gap-2">
                    <button className="p-1 hover:bg-blueDark hover:text-light rounded"
                      onClick={() => toast.error("Not implemented yet")}>
                      <MdImage
                        className="h-5 w-5"
                        onClick={() => {
                          void exportComponentAsPNG(containerRef);
                        }}
                      />
                    </button>
                    <button className="p-1 hover:bg-blueDark hover:text-light rounded"
                      onClick={() => toast.error("Not implemented yet")}>
                      <TbTrash className="h-5 w-5" /></button>
                    <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                      <TbRefresh
                        className="h-5 w-5"
                        onClick={() => {
                          void setOpenAIFetching(true);
                          void setOpenAIResponse("null");
                          void setOpenAIRefetching(true);
                          void reSearch();
                        }}
                      />
                    </button>
                    <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                      <TbCopy className="h-5 w-5"
                        onClick={() => {
                          void setValue(openAIResponse);
                          toast.success("Copied to clipboard");
                        }}/>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SearchProvider.Provider>
    </>
  );
};