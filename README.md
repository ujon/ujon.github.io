# ujon.github.io

## deploy

```sh
USE_SSH=true DEPLOYMENT_BRANCH=website bun run deploy
```

## translation

```shell
# docs
mkdir -p i18n/ko/docusaurus-plugin-content-docs/current
cp -r docs/** i18n/ko/docusaurus-plugin-content-docs/current
# blog
mkdir -p i18n/ko/docusaurus-plugin-content-blog
cp -r blog/** i18n/ko/docusaurus-plugin-content-blog
```
