#!/bin/bash
echo "*** deploy.sh ***"
github_user=`git remote -v | grep push | sed -e 's/^.*github.com\///g' -e 's/\/.*$//g'`
if [ "$github_user" == "fluanceit" ] || [ "$github_user" == "devfluance" ]; then
	echo "*** Deploying docs ***"
    cd build_docs
    git init
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push --force --quiet "https://${GH_USER}:${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
    echo "*** Deployed docs ***"
    cd ..
    echo "*** Fetching commit message from source repo ***"
    git clone https://github.com/fluanceit/angular-dashboard.git
    cd angular-dashboard
    tag_comment=`git log -1 --pretty=%B`
    cd ..
    echo "*** Got commit message ***"
	echo "*** Deploying dist ***"
	git clone https://github.com/fluanceit/bower-angular-dashboard.git
	cp -rf ./dist/* ./bower-angular-dashboard
	cp -rf ./bower_angular_dashboard/* ./bower-angular-dashboard
	cd bower-angular-dashboard
    git config user.name "Travis CI"
    git config user.email "frontdev@fluance.net"
    git config push.default simple
    git add .
    git commit -m "$tag_comment"
    tag_sha=`git log --pretty=format:'%h' -n 1`
    tag_ver=`cat bower.json | grep -Po '(?<="version": ")[^"]*'`
    git tag "v$tag_ver-build.${TRAVIS_BUILD_NUMBER}+sha.$tag_sha"
    git push -f -q --tags "https://${GH_USER}:${GH_TOKEN}@${GH_BOWER_REF}" master > /dev/null 2>&1
	echo "*** Deployed dist ***"
fi
echo "*** done deploy.sh ***"
