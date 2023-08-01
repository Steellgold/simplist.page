"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { providers } from "#/lib/configs/provider/provider.config";
import { useCopyToClipboard, useEventListener } from "usehooks-ts";
import { TbCopy, TbRefresh, TbTrash } from "react-icons/tb";
import { Providers, SearchProvider } from "../providers";
import type { Component } from "#/lib/utils/component";
import { Text } from "#/lib/components/atoms/text";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useRef, useState } from "react";
import { MdImage } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { toPng } from "html-to-image";
import Image from "next/image";
import clsx from "clsx";

export const SearchBar: Component<{ connected?: boolean; randomQuestion: string }> = ({ connected, randomQuestion }) =>  {
  const supabase = createClientComponentClient();

  const [search, setSearch] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>(providers[0]);
  const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
  const [openAIFetching, setOpenAIFetching] = useState<boolean>(false);
  const [openAIRefetching, setOpenAIRefetching] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [__, setValue] = useCopyToClipboard();

  const handleSearch = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!search) return;
    if (search.length == 0 || search.trim().length === 0) return;
    if (provider.name !== "GPT") {
      window.location.href = provider.url.replace("{search}", encodeURIComponent(search));
      return;
    }

    if (provider.name == "GPT") {
      if (!connected) return;
      if (history.includes(search)) {
        toast.error("You already asked this question (Click on the refresh button to ask again)");
        return;
      }

      setHistory([...history, search]);
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
    if (!connected) return;
    if (!search) return;
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

  const containerRef = useRef(null);

  const htmlToImageConvert = (): void => {
    if (!connected) return;
    if (!search) return;
    toPng(containerRef.current!, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = search.toLocaleLowerCase().replace(" ", "-") + ".png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onTabPressed = (event: KeyboardEvent): void => {
    if (event.code == "Tab" && (search == "" || search == null)) {
      setSearch(randomQuestion);
      event.preventDefault();
    }
  };

  useEventListener("keydown", onTabPressed);

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
        <div ref={containerRef}>
          <div className={clsx(
            "flex flex-col bg-[#1E293B] p-1 rounded-full mt-4 w-full max-w-2xl", {
              "p-3 rounded-md": provider.name == "GPT" && openAIResponse != null
            }
          )}>
            <div className="flex items-center justify-between">
              <Providers />

              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form className="flex flex-1" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={search || ""}
                  autoFocus={true}
                  placeholder={randomQuestion}
                  className={clsx(
                    "text-[#707F97] w-full placeholder-[#3f4753] outline-none ml-2 bg-transparent", {
                      "cursor-not-allowed": !connected
                    }
                  )}
                  disabled={!connected}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && search.length > 0 && (
                  <button
                    type="button"
                    className="flex items-center justify-center p-3"
                    onClick={() => {
                      void setSearch(null);
                      void setOpenAIResponse(null);
                    }}
                  >
                    <AiOutlineClose className="text-[#707F97]" />
                  </button>
                )}
              </form>
            </div>

            <div>
              {provider.name == "GPT" && openAIResponse && (
                <>
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
                          onClick={() => {
                            void setSearch(null);
                            void setOpenAIResponse(null);
                            toast.success("Your conversation has been deleted");
                          }}>
                          <TbTrash className="h-5 w-5" /></button>
                        <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                          <TbRefresh
                            className="h-5 w-5"
                            onClick={() => {
                              void setOpenAIFetching(true);
                              void setOpenAIResponse("null");
                              void setOpenAIRefetching(true);
                              void reSearch();
                              toast.success("Sam is thinking to an better answer...");
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
                </>
              )}
            </div>
          </div>
        </div>

        {connected && provider.name == "GPT" && (
          <div className="flex items-center justify-end mt-1 gap-2">
            {openAIResponse && !openAIFetching && !openAIRefetching && (
              <button className="text-[#707F97] flex items-center p-1 hover:text-light rounded" onClick={() => {
                void htmlToImageConvert();
              }}>
                <MdImage className="h-5 w-5"/>&nbsp;Export as image
              </button>
            )}

            <button className="text-[#707F97] flex items-center p-1 hover:text-light rounded" onClick={() => {
              void console.log("TODO: Redirect to stripe");
            }}>
              <Image src={"/coin.png" } alt="Simplist logo" width={20} height={20} />
              &nbsp;0 credits left
            </button>
          </div>
        )}

        {!connected && provider.name == "GPT" && (
          <div className="flex flex-col items-center justify-center mt-1 gap-2">
            <Text>To use this feature, please login with one of this two providers below</Text>
            <div className="flex items-center justify-center gap-2">
              <button className="text-[#707F97] flex items-center p-1 hover:text-light rounded" onClick={() => {
                void supabase.auth.signInWithOAuth({ provider: "github", options: {
                  redirectTo: window.location.origin + "/auth/callback"
                } });
              }}>
                <BsGithub className="h-5 w-5" color="white" />
                &nbsp;Login with GitHub
              </button>

              <button className="text-[#707F97] flex items-center p-1 hover:text-light rounded" onClick={() => {
                void supabase.auth.signInWithOAuth({ provider: "google", options: {
                  redirectTo: window.location.origin + "/auth/callback"
                } });
              }}>
                <FcGoogle className="h-5 w-5" />
                &nbsp;Login with Google
              </button>
            </div>
          </div>
        )}
      </SearchProvider.Provider>
    </>
  );
};