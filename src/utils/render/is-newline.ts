export const isNewLine = node => node.type === "text" && node.value.match(/^\s$/) !== null;
