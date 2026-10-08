const NewLineDelimiter = "";

export const QueryBuilder = (
	input: string,
	context?: string | undefined,
	rules?: string | undefined,
): string => {
	let query = "";

	if (context?.length) {
		query = `# Context:
  ${context}
  ${NewLineDelimiter}
    `;
	}

	query += `# Query:
  ${input}`;

	if (rules?.length) {
		query += `
  # Rules:
  ${NewLineDelimiter}
  ${rules}`;
	}

	return encodeURIComponent(query);
};
