"use client";

import { useActionState } from "react";
import {
  saveRenunganAction,
  type RenunganFormState,
} from "../renungan.actions";

const INITIAL_STATE: RenunganFormState = {};

export function useRenunganForm() {
  const [state, formAction, isPending] = useActionState(
    saveRenunganAction,
    INITIAL_STATE,
  );

  return { error: state.error, formAction, isPending };
}
