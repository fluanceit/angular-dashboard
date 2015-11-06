#!/bin/bash
echo "*** deploy.sh ***"
github_user=`git remote -v | grep push | sed -e 's/^.*github.com\///g' -e 's/\/.*$//g'`
echo "Github user: " $github_user
if [ "$github_user" == "fluanceit" ] || [ "$github_user" == "mambax" ]; then
	echo "*** Deploying docs ***"
	ls
    cd build_docs
    git init
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
    echo "*** Deployed docs ***"
	echo "*** Deploying dist ***"
	ls
	cd ..
	ls
	git clone https://${GH_TOKEN}@github.com/fluanceit/bower-angular-dashboard.git
	cp -rf ./dist ./bower-angular-dashboard
	cd bower-angular-dashboard
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Dist Repo"
    git push --quiet > /dev/null 2>&1
	echo "*** Deployed dist ***"
fi
echo "*** done ***"