VERSION ?= patch
NPMRC ?= listenfirst
AWS_ACCESS_KEY_ID ?= $(shell aws configure get aws_access_key_id)
AWS_SECRET_ACCESS_KEY ?= $(shell aws configure get aws_secret_access_key)
OSX_KEYCHAIN ?= ~/Library/Keychains/ListenFirst.keychain-db
OSX_KEYCHAIN_USER ?= mike.stanley@listenfirstmedia.com
CDN_DISTRIBUTION_ID ?= E36SQ3NOD1A0TN

release: release-npm release-tarball release-win release-macos

release-npm:
	npm version $(VERSION)
	git push origin master --tags
	npmrc $(NPMRC) 
	npm publish 

release-tarball:
	rm -rf tmp/lf-cli dist/lf-cli
	npx oclif-dev pack
	AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) npx oclif-dev publish

release-win:
	rm -rf tmp/win* dist/win*
	npx oclif-dev pack:win
	AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) npx oclif-dev publish:win

release-macos:
	rm -rf tmp/mac* dist/mac*
	OSX_KEYCHAIN=$(OSX_KEYCHAIN) npx oclif-dev pack:macos
	OSX_KEYCHAIN=$(OSX_KEYCHAIN) xcrun altool --notarize-app --primary-bundle-id "io.listenfirst.cli" -u $(OSX_KEYCHAIN_USER) --password "@keychain:altool" --file ./dist/macos/lf-cli-v*.pkg
	AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) npx oclif-dev publish:macos

invalidate-cdn:
	aws --profile lfmprod cloudfront create-invalidation \
  		--distribution-id $(CDN_DISTRIBUTION_ID) \
  		--paths \
    	"/lf-cli-darwin-x64.tar.gz" \
    	"/lf-cli-linux-arm.tar.gz" \
    	"/lf-cli-linux-x64.tar.gz" \
    	"/lf-cli-win32-x64.tar.gz" \
    	"/lf-cli-win32-x86.tar.gz" \
    	"/lf-cli-x64.exe" \
    	"/lf-cli-x86.exe" \
    	"/lf-cli.pkg" \
    	"/lf-cli.tar.gz" \
    	"/version"
