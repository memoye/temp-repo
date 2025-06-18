import { SelectItem } from "@/components/ui/select";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";
import { blockTypeToBlockName } from "./block-format-data";
import { useToolbarContext } from "@/context/editor/toolbar-context";

const BLOCK_FORMAT_VALUE = "paragraph";

export function FormatParagraph() {
  const { activeEditor } = useToolbarContext();

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatParagraph}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </SelectItem>
  );
}
