#!/bin/bash
mkdir -p ./.tmp/

for f in public/*.html public/**/*.html
do
  echo "Inlining critical css of $f"
  mkdir -p $(dirname ./.tmp/$f)
  critical "$f" --base public/ --inline > ./.tmp/$f
  mv ./.tmp/$f $f
done

rm -r ./.tmp
