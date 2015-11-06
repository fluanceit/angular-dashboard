#!/bin/bash
echo "*** deploy.sh ***"
github_user=`git remote -v | grep push | sed -e 's/^.*github.com\///g' -e 's/\/.*$//g'`
github_branch=`git branch`
echo $github_user " in " $github_branch
if [ "$github_user" == "fluanceit" ]; then
	echo "*** Deploying docs ***"
    cd build_docs
    git init
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
    echo "*** Deployed docs ***"
	echo "*** Deploying dist ***"
	cd ..
	git clone https://${GH_TOKEN}@github.com/fluanceit/bower-angular-dashboard.git
	cp -rf ./dist/* ./bower-angular-dashboard
	cd bower-angular-dashboard
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Dist Repo"
    git push --quiet > /dev/null 2>&1
	echo "*** Deployed dist ***"
fi
echo "*** done ***"