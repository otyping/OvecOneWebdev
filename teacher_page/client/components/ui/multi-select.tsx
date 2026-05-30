import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * MultiSelect (Combobox) — shadcn pattern
 * เลือกได้หลายค่า + ค้นหา + แสดง chips ถอดได้
 * ใช้ semantic tokens ทั้งหมด รองรับ dark mode
 */
export interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  /** จำกัดความสูง popover (px). ดีฟอลต์ 240 */
  maxListHeight?: number;
  /** ปิด popover อัตโนมัติเมื่อเลือก (ดีฟอลต์ false เพราะมัก multi-select) */
  closeOnSelect?: boolean;
  id?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  searchPlaceholder = "ค้นหา...",
  emptyText = "ไม่พบรายการ",
  className,
  maxListHeight = 240,
  closeOnSelect = false,
  id,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();

  const handleToggle = React.useCallback(
    (item: string) => {
      if (value.includes(item)) {
        onChange(value.filter((v) => v !== item));
      } else {
        onChange([...value, item]);
      }
      if (closeOnSelect) setOpen(false);
    },
    [value, onChange, closeOnSelect],
  );

  const handleRemove = React.useCallback(
    (item: string, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      onChange(value.filter((v) => v !== item));
    },
    [value, onChange],
  );

  const transition = {
    duration: reduce ? 0 : DURATION.fast,
    ease: EASE_OUT,
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background/70 px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-colors hover:bg-background/90",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <span
              className={cn(
                "truncate text-left",
                value.length === 0 && "text-muted-foreground",
              )}
            >
              {value.length === 0
                ? placeholder
                : `เลือกแล้ว ${value.length} รายการ`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[var(--radix-popover-trigger-width)] min-w-[14rem] rounded-xl border border-border bg-popover p-0 shadow-soft-lg"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder={searchPlaceholder}
              className="text-sm"
            />
            <CommandList style={{ maxHeight: maxListHeight }}>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => handleToggle(option)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded border transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-transparent",
                        )}
                        aria-hidden
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* chips ที่เลือก — animate เข้า/ออกด้วย opacity+scale */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {value.map((item) => (
              <motion.span
                key={item}
                layout={!reduce}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={transition}
              >
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-medium text-secondary hover:bg-secondary/25"
                >
                  <span className="max-w-[14rem] truncate">{item}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(item, e)}
                    aria-label={`ลบ ${item}`}
                    className="-mr-0.5 grid h-4 w-4 place-items-center rounded-full transition-colors hover:bg-secondary/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
