@echo off
set platform=%1
set arch=%2
echo Win32용 sqlite3는 따로 빌드해야함.
echo %platform% %arch% %~nx0
goto TOEXIT
if [ "$platform" = "" ]; then
	echo usage %0 \<platform\> \<arch\>
	goto TOEXIT
fi
if [ "$arch" = "" ]; then
	echo usage %0 \<platform\> \<arch\>
	goto TOEXIT
fi

cd node_modules\sqlite3\
npm install
npm run prepublish
node-gyp configure --module_name=node_sqlite3 --module_path=..\lib\binding\electron-v1.2-$platform-$arch
node-gyp rebuild --target=1.2.3 --arch=$arch --target_platform=$platform --dist-url=https://atom.io/download/atom-shell --module_name=node_sqlite3 --module_path=..\lib\binding\electron-v1.2-$platform-$arch
del /f node_modules
npm install --production
cd ..\..\


:TOEXIT
pause