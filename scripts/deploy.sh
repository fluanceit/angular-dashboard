#!/bin/bash
echo "*** deploy.sh ***"
github_user=`git remote -v | grep push | sed -e 's/^.*github.com\///g' -e 's/\/.*$//g'`
echo "Github user: " $github_user
if [ "$github_user" == "fluanceit" ] || [ "$github_user" == "mambax" ]; then
	echo "*** Deploying docs ***"
    cd build_docs
    git init
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
    echo "*** Deployed docs ***"
    cd ..
	echo "*** Deploying dist ***"
	git clone https://github.com/fluanceit/bower-angular-dashboard.git
	cp -rf ./dist/* ./bower-angular-dashboard
	cp -rf ./bower_angular_dashboard/* ./bower-angular-dashboard
	cd bower-angular-dashboard
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git config push.default simple
    git add .
    git commit -m "Deploy to GitHub Dist Repo"
    tag_sha=`git log --pretty=format:'%h' -n 1`
    tag_ver=`cat bower.json | grep -Po '(?<="version": ")[^"]*'`
    git tag "v$tag_ver-build.${TRAVIS_BUILD_ID}+sha.$tag_sha"
    git push -f -q --tags "https://$github_user:$GITHUB_API_KEY@${GH_BOWER_REF}" master > /dev/null 2>&1
	echo "*** Deployed dist ***"
fi
echo "*** done ***"