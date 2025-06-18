import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "@/lib/editor-utils";

export function LinkPlugin() {
  return <LexicalLinkPlugin validateUrl={validateUrl} />;
}
