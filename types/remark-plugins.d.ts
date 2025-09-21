declare module 'remark-heading-id' {
    import { Plugin } from 'unified';

    interface RemarkHeadingIdOptions {
        defaults?: boolean;
    }

    const remarkHeadingId: Plugin<[RemarkHeadingIdOptions?]>;
    export default remarkHeadingId;
}

declare module 'remark-prism' {
    import { Plugin } from 'unified';

    interface RemarkPrismOptions {
        plugins?: string[];
    }

    const remarkPrism: Plugin<[RemarkPrismOptions?]>;
    export default remarkPrism;
}
