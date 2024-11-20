FROM oven/bun

WORKDIR /app

COPY . /app

# Absolutely no idea why, but piping the output directly to the file makes it empty.
RUN mkdir -p /tmp/templates && mv /app/templates/*.html /tmp/templates/
RUN bunx html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true /tmp/templates/index.html > /app/templates/index.html
RUN bun install --production

EXPOSE 3000

ENTRYPOINT ["bun", "run", "start"]

