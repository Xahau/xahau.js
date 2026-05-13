#!/usr/bin/env bash
set -euo pipefail

package_path="$1"
package_file="$package_path/package.json"
current_version="$(jq -r .version "$package_file")"
changed="false"

if [[ -z "${BASE_REF:-}" || "${BASE_REF:-}" =~ ^0+$ ]]; then
  BASE_REF="HEAD^"
fi

if previous_package="$(git show "$BASE_REF:$package_file" 2>/dev/null)"; then
  previous_version="$(jq -r .version <<<"$previous_package")"
  if [[ "$current_version" != "$previous_version" ]]; then
    changed="true"
  fi
else
  changed="true"
fi

echo "changed=$changed" >> "$GITHUB_OUTPUT"
echo "$package_path version changed: $changed"
