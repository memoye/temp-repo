import {
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical";
import { ListItemNode, ListNode } from "@lexical/list";
import { HashtagNode } from "@lexical/hashtag";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { OverflowNode } from "@lexical/overflow";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  LinkNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  HashtagNode,
  AutoLinkNode,
  OverflowNode,
];
