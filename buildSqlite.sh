#!/usr/bin/env bash
platform=$1
arch=$2
echo Win32용 sqlite3는 따로 빌드해야함.
if [ "$platform" = "" ]; then
	echo usage $0 \<platform\> \<arch\>
    exit;
fi
if [ "$arch" = "" ]; then
	echo usage $0 \<platform\> \<arch\>
    exit;
fi

cd node_modules/sqlite3/
npm install
npm run prepublish
node-gyp configure --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.2-$platform-$arch
node-gyp rebuild --target=1.2.3 --arch=$arch --target_platform=$platform --dist-url=https://atom.io/download/atom-shell --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.2-$platform-$arch
rm -rf node_modules
npm install --production
cd -
