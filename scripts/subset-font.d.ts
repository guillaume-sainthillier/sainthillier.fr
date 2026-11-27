// subset-font ships no types: the part of its API that subset-fonts.ts uses
declare module 'subset-font' {
    type Axis = number | { min: number; max: number; default?: number }

    type Options = {
        targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype'
        preserveNameIds?: number[]
        variationAxes?: Record<string, Axis>
        noLayoutClosure?: boolean
        keepFeatures?: string[]
    }

    export default function subsetFont(font: Buffer, text: string, options?: Options): Promise<Buffer>
}
