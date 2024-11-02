#ifndef ADDER
#define ADDER

#include <iostream>
#include <emscripten.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    int adder(int a, int b);
}

#endif