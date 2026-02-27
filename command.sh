for file in $(git log --diff-filter=D --name-only --format="" | grep -E "oracle.*\.ts$"); do
  commit=$(git rev-list -n 1 HEAD -- "$file")
  if [ ! -z "$commit" ]; then
    git checkout "$commit~1" -- "$file"
    echo "restore: $file"
  fi
done
rsync -av packages/xrpl/ packages/xahau/ && rm -rf packages/xrpl/
