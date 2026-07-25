import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // reglas recomendadas de JavaScript
  eslint.configs.recommended,
  // reglas recomendadas de TypeScript
  ...tseslint.configs.recommended,
  // apaga las reglas de ESLint que entran en conflicto con Prettier
  eslintConfigPrettier
);