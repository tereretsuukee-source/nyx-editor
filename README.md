# NyxEditor

A production-grade, security-hardened text editor with zero dynamic code execution.

## Security Design

- **No eval() / new Function()**: Enforced by ESLint rules and architecture.
- **Input Validation**: Length limits, depth checks, and null-byte filtering on all inputs.
- **CSP**: Strict Content Security Policy with `wasm-unsafe-eval` (WASM sandbox only, not JS eval).
- **Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **No Source Maps**: Disabled in production to prevent code leakage.

## Features

- Monaco Editor with custom Matrix Green / Amber Phosphor themes
- File System Access API (open folders, edit files)
- VS Code-style Command Palette (Ctrl+Shift+P)
- Logic Visualization: AST, Control Flow, Data Flow, Julia analysis
- Languages: JS, TS, Python, Rust, Go, C/C++, Java, Julia, Brainfuck, and more

## Install

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## LSP Integration (Optional)

Set `NEXT_PUBLIC_LSP_URL=wss://your-lsp-server` to enable Language Server Protocol.
The LSP server must run in an isolated process with resource quotas.

## Tree-sitter (Optional)

For advanced AST parsing beyond the fallback parser, build grammar WASM files
and place them in `public/tree-sitter/`.
