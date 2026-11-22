import zhNodeDefs from '../../../locales/zh/nodeDefs.json';
import zhMain from '../../../locales/zh/main.json';
import type { NodeCard } from '../api/nodes';

type Labels = {
    display_name?: string;
    description?: string;
    inputs?: Record<string, { name?: string }>;
    outputs?: Record<string, { name?: string }>;
};
const chineseDefinitions: Record<string, Labels> = zhNodeDefs;
const chineseCategories: Record<string, string> = zhMain.nodeCategories;

export function nodeCategoryLabel(segment: string, locale: string) {
    return locale === 'zh' ? chineseCategories[segment.replace(/\./g, '_')] ?? segment : segment;
}

export function localizeNodeCard(node: NodeCard, locale: string): NodeCard {
    const translation = locale === 'zh' ? chineseDefinitions[node.id] : undefined;
    const title = translation?.display_name ?? node.title;
    return {
        ...node,
        title,
        description: translation?.description ?? node.description,
        aliases: title === node.title ? node.aliases : [...node.aliases, node.title],
        inputs: node.inputs.map(([id, type]) =>
            [translation?.inputs?.[id]?.name ?? node.inputLabels?.[id] ?? id, type]),
        outputs: node.outputs.map(([name, type], index) => [translation?.outputs?.[index]?.name ?? name, type]),
    };
}
