"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import { tasksStore } from "../store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => tasksStore());

  return <Provider store={store}>{children}</Provider>;
}
