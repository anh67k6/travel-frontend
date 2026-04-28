export type AuthResponse = {
  token: string;
  userId: string;
  email: string;
};

export type Trip = {
  id: string;
  title: string;
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  assigneeParticipantId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseSplit = {
  participantId: string;
  amountMinor: number;
};

export type Expense = {
  id: string;
  paidByParticipantId: string;
  amountMinor: number;
  currencyCode: string;
  note: string | null;
  spentAt: string;
  createdAt: string;
  splits: ExpenseSplit[];
};

export type Balance = {
  participantId: string;
  paidMinor: number;
  owedMinor: number;
  netMinor: number;
};

export type ImageItem = {
  id: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  caption: string | null;
  uploadedByParticipantId: string | null;
  createdAt: string;
};
