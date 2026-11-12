declare module "hanzi" {
  export interface HanziDecomposeResult {
    components: string[];
    // The underlying library may return additional fields; keep them flexible.
    [key: string]: unknown;
  }

  export interface HanziModule {
    start: () => void;
    decompose: (hanzi: string, level?: number) => HanziDecomposeResult;
    getStrokes: (char: string) => string[];
    // The underlying library may expose additional functions; keep them flexible.
    [key: string]: unknown;
  }

  const hanzi: HanziModule;
  export default hanzi;
}
