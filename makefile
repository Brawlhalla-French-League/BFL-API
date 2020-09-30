make:
	firebase deploy --only functions

emulate:
	cd functions && npm run build && cd .. && firebase emulators:start --only functions

local-env:
	firebase functions:config:get > functions/.runtimeconfig.json