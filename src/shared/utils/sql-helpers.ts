export const sqlHelpers = {
  /**
   * Generates a dynamic WHERE clause based on non-null filters
   */
  where(filters: Record<string, any>, startPlaceholder = 1) {
    const conditions: string[] = [];
    const values: any[] = [];
    let placeholder = startPlaceholder;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string" && value.includes("%")) {
          conditions.push(`${key} ILIKE $${placeholder}`);
        } else {
          conditions.push(`${key} = $${placeholder}`);
        }
        values.push(value);
        placeholder++;
      }
    });

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      values,
      nextPlaceholder: placeholder,
    };
  },

  /**
   * Generates a dynamic ORDER BY clause
   */
  orderBy(sort: string, allowedColumns: string[]) {
    const [column, direction] = sort.includes(":") 
      ? sort.split(":") 
      : [sort, "DESC"];

    if (!allowedColumns.includes(column)) {
      return "ORDER BY created_at DESC";
    }

    const validDirection = direction.toUpperCase() === "ASC" ? "ASC" : "DESC";
    return `ORDER BY ${column} ${validDirection}`;
  },

  /**
   * Generates LIMIT and OFFSET clauses for pagination
   */
  paginate(limit: number, offset: number, startPlaceholder: number) {
    return {
      clause: `LIMIT $${startPlaceholder} OFFSET $${startPlaceholder + 1}`,
      placeholders: [limit, offset],
    };
  }
};
