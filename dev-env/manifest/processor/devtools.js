import html from './lib/html'

const process = function ({page, buildPath, scripts}) {
    if (!page) return

    scripts.push(html(page, buildPath))

    return true
}

export default function (manifest, {buildPath}) {
    const {devtools_page} = manifest;

    if (!devtools_page) return;

    const scripts = []

    process({page: devtools_page, buildPath, scripts});

    return {scripts};
}