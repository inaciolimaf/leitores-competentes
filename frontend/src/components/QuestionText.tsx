import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface QuestionTextProps {
  text: string;
  className?: string;
}

export function QuestionText({ text, className = "" }: QuestionTextProps) {
  if (!text || !text.trim()) return null;

  return (
    <div className={`text-slate-800 font-sans leading-relaxed text-[0.98rem] ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Título centralizado e sem recuo
          h3: ({ children }) => <h3 className="font-extrabold text-slate-900 text-center text-lg mb-6 uppercase tracking-wide">{children}</h3>,
          // Parágrafos com recuo e justificados
          p: ({ children }) => <div className="whitespace-pre-wrap mb-4 leading-relaxed break-words indent-8 text-justify">{children}</div>,
          strong: ({ children }) => <strong className="font-extrabold text-slate-900">{children}</strong>,
          code: ({ children }) => <span className="font-sans break-words whitespace-pre-wrap">{children}</span>,
          pre: ({ children }) => <div className="whitespace-pre-wrap mb-4 font-sans break-words bg-transparent p-0 border-0">{children}</div>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
