---
name: summarize-learnings
description: Summarize what was learned in the conversation into markdown format and post it to the local API endpoint
disable-model-invocation: true
allowed-tools: Bash, Write
---

# Summarize Learnings

Create a comprehensive markdown summary of what was learned or accomplished in this conversation. Then post it to the local markdown API endpoint.

## Instructions

1. **Review the conversation**: Look at the recent messages and identify key learnings, decisions made, code written, or concepts explained.

2. **Create a markdown summary** with the following structure:
   - Title (# heading)
   - Brief overview paragraph
   - Key points (## headings with bullet points or sections)
   - Code snippets if relevant (with proper markdown code blocks)
   - Conclusions or next steps

3. **Format considerations**:
   - Use proper markdown syntax (headings, lists, code blocks, etc.)
   - Be concise but comprehensive
   - Focus on what was accomplished or learned
   - Include specific technical details (file paths, function names, etc.)

4. **Save and post**:
   - Write the markdown summary to a temporary file in the scratchpad directory
   - Use the `scripts/post-markdown.sh` script to post it to the API
   - The script handles all JSON escaping and API communication
   - Show the response from the server

## Usage

After creating the markdown file, run:

```bash
./.claude/skills/summarize-learnings/scripts/post-markdown.sh /path/to/summary.md
```

The script will POST the markdown content to `http://localhost:3000/markdown` and display the server response.
