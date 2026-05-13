#!/usr/bin/env bash
set -euo pipefail

package_spec="$1"
stderr_file="$(mktemp)"

if npm view "$package_spec" version --registry "https://registry.npmjs.org" 2>"$stderr_file"; then
  echo "$package_spec is already published." >&2
  exit 1
fi

if grep -Eq "E404|404 Not Found|is not in this registry" "$stderr_file"; then
  echo "$package_spec is not published yet."
  exit 0
fi

cat "$stderr_file" >&2
exit 1
