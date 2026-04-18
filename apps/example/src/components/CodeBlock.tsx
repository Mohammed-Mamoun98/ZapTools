"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { type BundledLanguage, codeToHtml } from "shiki";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: BundledLanguage;
  showLineNumbers?: boolean;
  fileName?: string;
};

interface CodeBlockContextType {
  code: string;
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

export const CodeBlock = ({
  code,
  language,
  fileName,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const [html, setHtml] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    codeToHtml(code, {
      lang: language,
      theme: "poimandres",
    }).then((highlightedHtml) => {
      if (!mounted.current) {
        setHtml(highlightedHtml);
        mounted.current = true;
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [code, language]);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(
          "relative bg-white/[0.025] border border-white/[0.07] rounded-xl overflow-hidden",
          className,
        )}
        {...props}
      >
        {/* Terminal dots */}
        <div className="flex gap-2 px-7 pt-5 pb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          {fileName && (
            <span className="absolute top-5 right-6 text-xs font-mono text-white/18">
              {fileName}
            </span>
          )}
        </div>

        {/* Code content */}
        <div className="px-7 pb-7 overflow-x-auto">
          <div
            className="[&>pre]:m-0 [&>pre]:bg-transparent! [&>pre]:p-0! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-[13px] [&_code]:leading-[1.85]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Copy button */}
        {children && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<"button"> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <button
      className={cn(
        "p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white",
        className,
      )}
      onClick={copyToClipboard}
      {...props}
    >
      {isCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
    </button>
  );
};
