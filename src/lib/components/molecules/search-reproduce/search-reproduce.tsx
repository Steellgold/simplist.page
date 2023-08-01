import { TbCopy, TbRefresh, TbTrash } from "react-icons/tb";
import { Providers } from "../providers";
import type { Component } from "#/lib/utils/component";
import { Text } from "#/lib/components/atoms/text";
import { AiOutlineClose } from "react-icons/ai";
import { MdImage } from "react-icons/md";
import clsx from "clsx";

export const SearchReproduce: Component<{ question: string; answer: string }> = ({ answer, question }) => {
  return (
    <>
      <div className={clsx("flex flex-col bg-[#1E293B] p-3 rounded-md mt-4 w-full max-w-2xl")}>
        <div className="flex items-center justify-between">
          <Providers />

          <form className="flex flex-1">
            <input
              type="text"
              value={question}
              placeholder={question}
              className="text-[#707F97] w-full placeholder-[#707F97] outline-none ml-2 bg-transparent"
            />

            <button type="button" className="flex items-center justify-center p-3">
              <AiOutlineClose className="text-[#707F97]" />
            </button>
          </form>
        </div>

        <div>
          <div className="mt-4 gap-2 text-[#707F97] border border-[#707F97] rounded p-2 bg-[#1E293B]">
            <Text className="leading-loose"><strong>Sam:</strong>&nbsp;{answer}</Text>

            <div className="flex items-center justify-end mt-2 gap-2">
              <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                <MdImage className="h-5 w-5" /></button>
              <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                <TbTrash className="h-5 w-5" /></button>
              <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                <TbRefresh className="h-5 w-5" />
              </button>
              <button className="p-1 hover:bg-blueDark hover:text-light rounded">
                <TbCopy className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};