"use client";

import { useEffect } from "react";
import { useLoadingBar } from "react-top-loading-bar";

export default function RootLoading() {
  const { start, complete } = useLoadingBar({});

  useEffect(() => {
    start();
    return () => complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="grid h-dvh w-screen place-items-center">Loading...</div>;
}
