const browserIs = (name, t) => (
  t.browser.alias.startsWith(name) || (process.env.BROWSER || '').startsWith(name)
)

export { browserIs }
