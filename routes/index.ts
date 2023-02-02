import type { AddOn } from 'atlassian-connect-express'
import type { Express } from 'express'
import type { RequestContext } from '../types/express'

export default function routes(app: Express, addon: AddOn) {
  /**
   * Health check
   */
  app.get('/api/health-check', (_, res) => {
    res.json({ status: 'ok' })
  })

  /**
   * Uninstall plugin and remove all client info
   */
  app.post('/uninstalled', addon.authenticateInstall(), async (req, res) => {
    try {
      const clientKey = (req as RequestContext).context.clientKey
      if (!clientKey) {
        throw new Error('Wrong client key.')
      }

      // remove settings
      await addon.settings.del('userSettings', clientKey)
      await addon.settings.del('clientInfo', clientKey)

      res.json({ status: 'ok' })
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Something went wrong.' })
    }
  })

  /**
   * Get user settings
   */
  app.get('/api/settings', addon.authenticate(true), async (req, res) => {
    try {
      const data = await addon.settings.get('userSettings', (req as RequestContext).context.clientKey)
      res.json({ status: 'ok', data })
    } catch (err) {
      res.status(500).json({ status: 'ok', message: err })
    }
  })

  /**
   * Save user settings
   */
  app.post('/api/settings', addon.authenticate(true), async (req, res) => {
    try {
      const userToken = String(req.body.token)
      const userData = { userToken }
      const data = await addon.settings.set('userSettings', userData, (req as RequestContext).context.clientKey)
      res.json({ status: 'ok', data })
    } catch (err) {
      res.status(500).json({ status: 'error', message: err })
    }
  })
}
