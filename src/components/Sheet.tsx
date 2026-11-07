import type { ReactNode } from "react";
import { Drawer } from "vaul";

/** iOS-style bottom sheet with a grabber; swipe down to dismiss. */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-overlay backdrop-blur-[2px]" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[94dvh] w-full max-w-md flex-col rounded-t-[28px] bg-bg outline-none"
        >
          <div className="mx-auto mt-2 mb-1 h-[5px] w-9 shrink-0 rounded-full bg-fill-2" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <div className="overflow-y-auto overscroll-contain px-4 pb-[max(env(safe-area-inset-bottom),20px)]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
