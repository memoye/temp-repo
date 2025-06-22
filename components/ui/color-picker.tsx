import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function ColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  icon,
  label,
  className,
  ...rest
}: Props) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          size={"icon"}
          className={cn("size-8! rounded-sm border-input", className)}
          variant={"outline"}
          {...rest}
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <HexColorPicker color={color} onChange={(color) => onChange?.(color, false)} />
        <Input
          maxLength={7}
          onChange={(e) => {
            e.stopPropagation();
            onChange?.(e?.currentTarget?.value, false);
          }}
          value={color}
        />
      </PopoverContent>
    </Popover>
  );
}
