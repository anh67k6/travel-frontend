import { Link } from "react-router-dom";
import { ParticipantForm } from "@/components/ParticipantForm";
import { TodoForm } from "@/components/TodoForm";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ImageUploadForm } from "@/components/ImageUploadForm";
import type { Balance, Expense, ImageItem, Participant, Todo, Trip } from "@/lib/types";

type Props = {
  trip?: Trip;
  isTripLoading: boolean;
  participants: Participant[];
  todos: Todo[];
  expenses: Expense[];
  balances: Balance[];
  images: ImageItem[];
  participantMap: Map<string, string>;
  onParticipantSubmit: (payload: { name: string; email?: string }) => Promise<unknown>;
  onTodoSubmit: (payload: { title: string; assigneeParticipantId?: string }) => Promise<unknown>;
  onToggleTodo: (todo: Todo) => void;
  onExpenseSubmit: (payload: {
    paidByParticipantId: string;
    amountMinor: number;
    currencyCode: string;
    note?: string;
    splitParticipantIds: string[];
  }) => Promise<unknown>;
  onImageUpload: (file: File, caption?: string) => Promise<unknown>;
};

export function TripDetailView({
  trip,
  isTripLoading,
  participants,
  todos,
  expenses,
  balances,
  images,
  participantMap,
  onParticipantSubmit,
  onTodoSubmit,
  onToggleTodo,
  onExpenseSubmit,
  onImageUpload,
}: Props) {
  return (
    <div className="app-shell">
      <Link className="btn-secondary w-fit" to="/">
        ← Back to trips
      </Link>

      <section className="card grid gap-2">
        {isTripLoading ? (
          <p className="text-sm text-slate-600">Loading trip...</p>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{trip?.title}</h1>
        )}
        {trip?.destination && <p className="text-sm text-slate-600">Destination: {trip.destination}</p>}
      </section>

      <section className="card grid gap-3">
        <h3 className="section-title">Participants</h3>
        <ParticipantForm onSubmit={onParticipantSubmit} />
        <ul className="grid gap-2">
          {participants.map((p) => (
            <li key={p.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
              {p.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="card grid gap-3">
        <h3 className="section-title">Todo List</h3>
        <TodoForm onSubmit={onTodoSubmit} />
        <ul className="grid gap-2">
          {todos.map((todo) => (
            <li key={todo.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  className="h-4 w-4 rounded border-surface-200 text-accent-500 focus:ring-accent-300"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleTodo(todo)}
                />
                {todo.title}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card grid gap-4">
        <ExpenseForm participants={participants} onSubmit={onExpenseSubmit} />

        <div className="grid gap-2">
          <h4 className="section-title">Expenses</h4>
          <ul className="grid gap-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {expense.amountMinor} {expense.currencyCode} paid by {participantMap.get(expense.paidByParticipantId) ?? "Unknown"}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2">
          <h4 className="section-title">Balances</h4>
          <ul className="grid gap-2">
            {balances.map((balance) => (
              <li key={balance.participantId} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {participantMap.get(balance.participantId) ?? balance.participantId}: {balance.netMinor}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card grid gap-4">
        <ImageUploadForm onUpload={onImageUpload} />
        <div className="grid gap-2">
          <h4 className="section-title">Images</h4>
          <ul className="grid gap-2">
            {images.map((image) => (
              <li key={image.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {image.storageKey} ({image.sizeBytes} bytes)
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
