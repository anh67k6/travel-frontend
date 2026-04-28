import { type FormEvent, useState } from "react";

type Params = {
  onUpload: (file: File, caption?: string) => Promise<unknown>;
};

export function useImageUploadForm({ onUpload }: Params) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      return;
    }

    await onUpload(file, caption || undefined);
    setFile(null);
    setCaption("");
  }

  return {
    file,
    caption,
    setFile,
    setCaption,
    handleSubmit,
  };
}
