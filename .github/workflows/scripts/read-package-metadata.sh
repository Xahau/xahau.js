#!/usr/bin/env bash
set -euo pipefail

package_path="$1"
package_file="$package_path/package.json"
name="$(jq -r .name "$package_file")"
version="$(jq -r .version "$package_file")"

echo "name=$name" >> "$GITHUB_OUTPUT"
echo "version=$version" >> "$GITHUB_OUTPUT"
echo "tag=$name@$version" >> "$GITHUB_OUTPUT"
