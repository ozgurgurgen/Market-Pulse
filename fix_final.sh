#!/bin/bash
sed -i -e '/const quotesMap/c \
    res.json({ quotes: quotes.filter(Boolean) });\
' server.ts

sed -i -e '/import React,/c \
import React, { useState, useEffect } from "react";\
' src/components/StockAnalysisModal.tsx

