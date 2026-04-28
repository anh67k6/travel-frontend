import { useImageUploadForm } from "@/hooks/ImageUploadForm/useImageUploadForm";

type Props = {
  onUpload: (file: File, caption?: string) => Promise<unknown>;
};

export function ImageUploadForm({ onUpload }: Props) {
  const { file, caption, setFile, setCaption, handleSubmit } = useImageUploadForm({ onUpload });

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
