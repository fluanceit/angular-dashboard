#!/bin/bash

github_user=`git remote -v | grep push | sed -e 's/^.*://g' -e 's/\/.*$//g'`
if [ "$github_user" == "sebastienbarbier" ]; then
    cd build_docs
    git init
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Pages"
    echo "Push on " ${GH_REF}
    echo "Push on " ${GH_TOKEN:10}
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
fi
