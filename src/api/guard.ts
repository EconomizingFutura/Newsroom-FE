export default function handler(req: any, res: any) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    ''

  const ALLOWED_PREFIXES = ['122.167.99.']

  const allowed = ALLOWED_PREFIXES.some(prefix => ip.startsWith(prefix))

  if (!allowed) {
    res.status(403).send('Access only from College Network')
    return
  }

  res.writeHead(302, { Location: '/' })
  res.end()
}
