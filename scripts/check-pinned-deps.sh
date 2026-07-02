#!/usr/bin/env bash
# Wrapper around pindeps --check that allows aws-cdk-lib and constructs to use version ranges.
set -euo pipefail

OUTPUT="$(npx pindeps --check 2>&1)" || true

# Filter out lines containing exempt packages
VIOLATIONS="$(echo "$OUTPUT" | grep ' -> ' | grep -vE 'aws-cdk-lib[[:space:]]|constructs[[:space:]]' || true)"

if [ -n "$VIOLATIONS" ]; then
  echo "$VIOLATIONS"
  echo ""
  echo "error: Unpinned dependencies found. Run 'npx pindeps' to pin them."
  exit 1
fi

exit 0
