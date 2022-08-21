// *****************************************************************************
// 共通TypeScriptを定義する
// 下記のように宣言
// import * as CHK003TypeScript from '@/Common/Hooks/CHK003TypeScript'
// 下記のように利用
// CHK003TypeScript.Weaken
// *****************************************************************************


/**
* Type T から プロパティ K の型を any に変換した type を返します。
*/
export type Weaken<T, K extends keyof T > = {
  [P in keyof T]: P extends K ? any : T[P]
}

/**
* Type T の全プロパティの型を ype TYPE に変換した type を返します。
*/
export type PropsWithType<T, TYPE> = { [P in keyof T]: TYPE };
