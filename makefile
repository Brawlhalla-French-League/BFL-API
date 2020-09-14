make:
	firebase deploy --only functions

emulate:
	cd functions && npm run build && cd .. && firebase emulators:start --only functions

local-env:
	cd functions && firebase functions:config:get > .runtimeconfig.json