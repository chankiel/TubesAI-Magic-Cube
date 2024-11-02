@echo off

set MODULE_NAME=cpp/adder
set EXPORT_NAME=adder
set OUTPUT_JS=src/wasm/adder_wasm.js
set OUTPUT_WASM=src/wasm/adder_wasm.wasm

emcc %MODULE_NAME%.cpp ^
    -o %OUTPUT_JS% ^
    -s EXPORT_ES6=1 ^
    -s "EXPORT_NAME=\"%EXPORT_NAME%\"" ^
    -s "ENVIRONMENT=\"web\""

pause