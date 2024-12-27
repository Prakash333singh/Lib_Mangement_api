export function fuzzySearch(
  query: string,
  books: any[],
  fields: string[],
): any[] {
  const lowerQuery = query.toLowerCase();

  return books.filter((book) =>
    fields.some((field) =>
      (book[field] || "").toString().toLowerCase().includes(lowerQuery),
    ),
  );
}
