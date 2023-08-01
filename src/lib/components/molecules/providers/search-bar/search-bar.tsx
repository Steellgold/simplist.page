"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Provider } from "#/lib/configs/provider/provider.type";
import { providers } from "#/lib/configs/provider/provider.config";
import { useCopyToClipboard, useEventListener } from "usehooks-ts";
import { TbCoins, TbCopy, TbRefresh, TbTrash } from "react-icons/tb";
import { Providers, SearchProvider } from "../providers";
import type { Component } from "#/lib/utils/component";
import { Text } from "#/lib/components/atoms/text";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { MdImage } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { toPng } from "html-to-image";
import clsx from "clsx";
import type { Cookie } from "cookie-muncher";
import { domCookie } from "cookie-muncher";
import Image from "next/image";

type SearchBarProps = {
  connected?: boolean;
  randomQuestion: string;
  userId: string;
};

const getCredits = async(): Promise<number> => {
  const data = await fetch("/api/credits");
  return parseInt(await data.text());
};

export const SearchBar: Component<SearchBarProps> = ({ connected, randomQuestion, userId }) =>  {
  const supabase = createClientComponentClient();
  const containerRef = useRef(null);

  const [av, setAV] = useState<Cookie | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>(providers[0]);

  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(0);

  const [isConnected, setIsConnected] = useState<boolean>(connected || false);
  const [__, setValue] = useCopyToClipboard();

  useEffect(() => {
    setAV(domCookie.get("alreadyVisited"));
    void getCredits().then(setCredits);
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAV(domCookie.get("alreadyVisited"));
      if (av?.value == "true") clearInterval(interval);
      console.log(av?.value);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  supabase.auth.onAuthStateChange((_, session) => {
    if (session) setIsConnected(true);
    else setIsConnected(false);
  });

  const handleSearch = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!search || search.length == 0 || search.trim().length === 0) return;
    if (provider.name !== "GPT") {
      window.location.href = provider.url.replace("{search}", encodeURIComponent(search));
      return;
    }

    if (provider.name == "GPT") {
      if (!isConnected) return;
      setIsThinking(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ search })
      });

      const r = await response.text().then(text => text.slice(1, -1));
      setResponse(r);
      setIsThinking(false);
      setCredits(credits - 1);
    }
  };

  const htmlToImageConvert = (): void => {
    if (!isConnected && provider.name == "GPT") return;
    if (!search) return;
    if (containerRef.current == null) return;

    toPng(containerRef.current, { cacheBust: true })
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

  const reSearch = async(): Promise<void> => {
    if (!isConnected && provider.name == "GPT") return;
    if (!search) return;
    if (search.length == 0 || search.trim().length === 0) return;

    if (provider.name == "GPT") {
      setIsThinking(true);

      const response = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ search }) });
      const res = await response.text().then(text => text.slice(1, -1));

      setCredits(credits - 1);
      setResponse(res);
      setIsThinking(false);
    }
  };

  const onTabPressed = (event: KeyboardEvent): void => {
    if (event.code == "Tab" && (search == "" || search == null)) {
      setSearch(randomQuestion);
      event.preventDefault();
    }
  };

  const handlePayment = async(): Promise<void> => {
    if (!isConnected && provider.name == "GPT") return;
    const response = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: { "Content-Type": "application/json" }
    });

    window.location.href = await response.text().then(text => text.slice(1, -1));
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

      <div className={clsx(
        "absolute", {
          "hidden": av?.value == "true"
        }
      )}>
        <Image
          src={"/arrow.png"}
          className="ml-5 mt-14"
          loading="lazy"
          alt="arrow pointing to the provider"
          width={400}
          height={100}
        />
      </div>

      <SearchProvider.Provider value={{ provider, setProvider }}>
        <div ref={containerRef}>
          <div className={clsx(
            "flex flex-col bg-[#1E293B] p-1 rounded-full mt-4 w-full max-w-2xl", {
              "p-3 rounded-md": provider.name == "GPT" && (response !== null || isThinking)
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
                      "cursor-not-allowed": !isConnected && provider.name == "GPT"
                    }
                  )}
                  disabled={!isConnected && provider.name == "GPT"}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && search.length > 0 && (
                  <button
                    type="button"
                    className="flex items-center justify-center p-3"
                    onClick={() => {
                      void setSearch(null);
                      void setResponse(null);
                    }}
                  >
                    <AiOutlineClose className="text-[#707F97]" />
                  </button>
                )}
              </form>
            </div>

            <div>
              {provider.name == "GPT" && (
                <div className={clsx(
                  "mt-4 gap-2 text-[#707F97] border border-[#707F97] rounded p-2 bg-[#1E293B]", {
                    "hidden": response == null,
                    "flex flex-col": response
                  }
                )}>
                  {isThinking && <Text>Sam is thinking</Text>}
                  {!isThinking && <Text><strong>Sam:</strong>&nbsp;{response}</Text>}

                  {!isThinking && (
                    <div className="flex items-center justify-end mt-2 gap-2">
                      <button className="p-1 rounded"
                        onClick={() => {
                          void htmlToImageConvert();
                        }}>
                        <MdImage className="h-5 w-5"/>
                      </button>
                      <button className="p-1 hover:bg-blueDark hover:text-light rounded"
                        onClick={() => {
                          void setSearch(null);
                          void setResponse(null);
                          toast.success("Your conversation has been deleted");
                        }}>
                        <TbTrash className="h-5 w-5" /></button>
                      <button className="p-1 hover:bg-blueDark hover:text-light rounded"
                        onClick={() => {
                          void reSearch();
                          toast.success("Sam is thinking to an better answer...");
                        }} >
                        <TbRefresh className="h-5 w-5" />
                      </button>
                      <button className="p-1 hover:bg-blueDark hover:text-light rounded"
                        onClick={() => {
                          void setValue(response || "");
                          toast.success("Copied to clipboard");
                        }}>
                        <TbCopy className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isConnected && provider.name == "GPT" && (
          <>
            <div className="flex items-center justify-end mt-1 gap-2">
              <button className="text-[#707F97] flex items-center p-1 hover:text-light rounded" onClick={() => {
                void handlePayment();
              }}>
                {credits > 0 && <>
                  <TbCoins className="h-5 w-5" />
                &nbsp;{credits} credits remaining
                </>}
                {credits == 0 && <>
                  <TbCoins className="h-5 w-5" />
                &nbsp;You don&apos;t have any credits. Click here to buy some
                </>}
              </button>
            </div>
          </>
        )}

        {!isConnected && provider.name == "GPT" && (
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