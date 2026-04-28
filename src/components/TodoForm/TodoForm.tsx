import { useToDoForm } from "@/hooks/ToDoForm/useToDoForm";

type Props = {
  onSubmit: (payload: { title: string; assigneeParticipantId?: string }) => Promise<unknown>;
};

export function TodoForm({ onSubmit }: Props) {
  const { title, setTitle, handleSubmit } = useToDoForm({ onSubmit });

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
      <input className="input-base" placeholder="Todo item" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <button className="btn-primary" type="submit">Add</button>
    </form>
  );
}
