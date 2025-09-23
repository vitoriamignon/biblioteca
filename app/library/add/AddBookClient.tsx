"use client";

import React from "react";
import { BookForm } from "@/components/book-form-server";
import { useRouter } from "next/navigation";

export default function AddBookClient() {
  const router = useRouter();

  return (
    <BookForm
      onCancel={() => router.push("/library")}
    />
  );
}
