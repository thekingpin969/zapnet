import type { Context } from "hono";
import isValidUrl from "../../utils/isUrl.ts";
import createUrlTunnel from "../../helpers/createUrlTunnel";

async function tunnelUrl(c: Context) {
    try {
        const { userid } = c.get('user')
        const { url } = await c.req.json()

        const validUrl = isValidUrl(url)
        if (!validUrl) return c.text('invalid url', 403)

        const { tunneledUrl } = await createUrlTunnel(url, userid, {})
        return c.json({ success: true, url: tunneledUrl }, 200)
    } catch (error) {
        console.log(error)
        return c.text('something went wrong', 500)
    }
}

export default tunnelUrl