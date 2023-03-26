import { HookParameter } from '../models/common';
export declare const tts: any;
export type TTS = typeof tts;
export declare function calculateHookOn(arr: Array<keyof TTS>): string;
export declare function sha256(string: string): Promise<string>;
export declare function hexNamespace(namespace: string): Promise<string>;
export declare function hexHookParameters(data: HookParameter[]): HookParameter[];
//# sourceMappingURL=hooks.d.ts.map