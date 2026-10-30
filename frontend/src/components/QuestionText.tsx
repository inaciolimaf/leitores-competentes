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
    <div className={`reading-text ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Título centralizado
          h3: ({ children }) => <h3>{children}</h3>,
                    p: ({ children }) => <div className="paragraph">{children}</div>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          code: ({ children }) => <span className="font-sans break-words whitespace-pre-wrap">{children}</span>,
          pre: ({ children }) => <div className="whitespace-pre-wrap mb-4 font-sans break-words bg-transparent p-0 border-0">{children}</div>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
