#!/bin/bash

# hivemind installer
# https://hivemind.flowercomputer.com

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'

NC='\033[0m' # No Color

BASE_URL="https://hivemind.flowercomputer.com/public"
INSTALLED=0

echo "${PURPLE}Installing hivemind...${NC}"
echo ""

# Claude Code
if [ -d "$HOME/.claude" ]; then
  mkdir -p "$HOME/.claude/commands"
  curl -sL -o "$HOME/.claude/commands/rams.md" "$RAMS_URL"
  echo "✓ Installed for Claude Code"
  INSTALLED=$((INSTALLED + 1))
fi

# Cursor
if [ -d "$HOME/.cursor" ]; then
  mkdir -p "$HOME/.cursor/commands"
  curl -sL -o "$HOME/.cursor/commands/rams.md" "$RAMS_URL"
  echo "✓ Installed for Cursor"
  INSTALLED=$((INSTALLED + 1))
fi

# OpenCode - check if binary exists OR config dir exists
if command -v opencode &> /dev/null || [ -d "$HOME/.config/opencode" ]; then
  mkdir -p "$HOME/.config/opencode/command"
  curl -sL -o "$HOME/.config/opencode/command/rams.md" "$RAMS_URL"
  echo "✓ Installed for OpenCode"
  INSTALLED=$((INSTALLED + 1))
fi

# Codex CLI - check if binary exists OR config dir exists
if command -v codex &> /dev/null || [ -d "$HOME/.codex" ]; then
  mkdir -p "$HOME/.codex/prompts"
  curl -sL -o "$HOME/.codex/prompts/rams.md" "$RAMS_URL"
  echo "✓ Installed for Codex"
  INSTALLED=$((INSTALLED + 1))
fi

# Antigravity (Gemini CLI) - install as global workflow
if [ -d "$HOME/.gemini" ]; then
  mkdir -p "$HOME/.gemini/antigravity/global_workflows"
  curl -sL -o "$HOME/.gemini/antigravity/global_workflows/rams.md" "$RAMS_URL"
  echo "✓ Installed for Antigravity"
  INSTALLED=$((INSTALLED + 1))
fi

echo ""

if [ $INSTALLED -eq 0 ]; then
  echo "No supported tools detected."
  echo ""
  echo "Install one of these first:"
  echo "  • Claude Code: https://claude.ai/code"
  echo "  • Cursor: https://cursor.com"
  echo "  • OpenCode: https://opencode.ai"
  echo "  • Codex: https://openai.com/codex"
  echo "  • Antigravity: https://antigravity.google"
  exit 1
fi

echo "Done! Type /rams in your editor to run."