# Simple room chat
Really simple room chat using Node.js with the socket.io module and the client that goes with it.

## Installation

Make sure have installed `node.js` on your computer, then install `` using the following in the root directory of your project

When you're on your directory, you will have to initialise a package.json file by doing this command:

```
npm init
```

Then you can press enter until it's done and when the file is created add this structure at the end of it:

```
	"dependencies":{
		"socket.io":*,
		"express":*
	}
```

When you are done with this, just run this command, again in the root directory of your project:
(It'll install your dependencies)

```
npm install
```

# Usage

To Start the server, in a node.js commande line terminal, go in the server directory and do:

```
node server.js
```

The client can now be launched from your browser, `http://localhost:3000`