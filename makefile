make:
	firebase deploy --only functions

local-env:
	cd functions && firebase functions:config:get > .runtimeconfig.json