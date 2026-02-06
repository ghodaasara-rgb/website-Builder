# Naming Conventions & SOP Rules

1. **API Names:** All API names for objects and fields must be auto-converted to `snake_case`.
2. **Reserved Words:** Never allow the creation of objects named: 'user', 'settings', 'sys_objects', 'sys_fields', 'auth', 'public'.
3. **Metadata Storage:** Always store specific configurations (Decimal places, Picklist values) in the `metadata_json` column.
4. **Safety:** When altering tables, always check if the column exists first to avoid SQL errors (handled by safe ALTER or `if not exists` logic where possible)..
