import { FormEvent, useState } from "react";

type Props = {
  onUpload: (file: File, caption?: string) => Promise<unknown>;
};

export function ImageUploadForm({ onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    await onUpload(file, caption || undefined);
    setFile(null);
    setCaption("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <h4 className="section-title">Upload Image</h4>
      <input
        className="input-base"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        required
      />
      <input className="input-base" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
      <button className="btn-primary w-full sm:w-fit" type="submit" disabled={!file}>
        Upload
      </button>
    </form>
  );
}
