export const queryKeys = {
  trips: () => ["trips"] as const,
  trip: (tripId: string) => ["trip", tripId] as const,
  participants: (tripId: string) => ["participants", tripId] as const,
  todos: (tripId: string) => ["todos", tripId] as const,
  expenses: (tripId: string) => ["expenses", tripId] as const,
  balances: (tripId: string) => ["balances", tripId] as const,
  images: (tripId: string) => ["images", tripId] as const,
};
