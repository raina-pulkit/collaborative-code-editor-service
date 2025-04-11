// src/global.d.ts

declare namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
  
  declare var __rootdir__: string;
  