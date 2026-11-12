import { TAtomValue } from "@/types/general.type";
import { atom } from "jotai";

export const DeleteDialogAtom = atom<TAtomValue>(undefined);

/** Controls the dashboard sidebar drawer on mobile (below the `sm` breakpoint). */
export const DashboardMobileNavAtom = atom<boolean>(false);
