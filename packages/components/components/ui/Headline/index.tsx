import { FC, ReactNode } from "react";
import { Heroic } from "@repo/types";

interface HeadlineProps extends Heroic {
  className?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
}

const Headline: FC<HeadlineProps> = ({ 
  isHero = false,
  level = "h3",
  className = "", 
  children 
}) => {

  const HeadingTag = isHero ? "h1" : level;
  
  // If children is a string, clean it and use dangerouslySetInnerHTML
  if (typeof children === "string") {
    // Strip out initial HTML tags (like <p>) that rich text editors add
    const cleanContent = (content: string) => {
      // Handle undefined or null content
      if (!content) return '';
      
      // Convert to string if not already
      const stringContent = String(content);
      
      // Basic cleaning - remove wrapper p tags and handle basic HTML
      return stringContent.replace(/^<p[^>]*>|<\/p>$/g, '');
    };
    
    const cleanedContent = cleanContent(children);
    
    return (
      <HeadingTag 
        className={`${className}`} 
        dangerouslySetInnerHTML={{ __html: cleanedContent }} 
      />
    );
  }
  
  // If children is ReactNode (JSX), render it directly
  return (
    <HeadingTag className={`${className}`}>
      {children}
    </HeadingTag>
  );
};

export { Headline };
export default Headline;