import { z } from 'zod'

const VanityResponseOk = z.object({
  response: z.object({ success: z.literal(1), steamid: z.string() }),
})
type TVanityResponseOk = z.infer<typeof VanityResponseOk>
const VanityResponseKo = z.object({
  response: z.object({ success: z.number(), message: z.string() }),
})
type TVanityResponseKo = z.infer<typeof VanityResponseKo>
const VanityResponse = z.union([VanityResponseKo, VanityResponseOk])

const GamesResponse = z.object({
  response: z.object({
    game_count: z.number(),
    games: z.array(
      z.object({
        appid: z.number(),
        name: z.string(),
        img_icon_url: z.string()
      }),
    ),
  }),
})

export function createSteamApi(apiKey: string) {
  return {
    async getSteamId(username: string) {
      const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${username}`
      const vanityResponse = await fetch(url)
      const vanityText = await vanityResponse.text()
      if (!vanityResponse.ok) {
        throw new Error(vanityText)
      }
      const vanityResult = VanityResponse.parse(JSON.parse(vanityText))

      if (vanityResult.response.success === 1) {
        const steamId = (vanityResult as TVanityResponseOk).response.steamid
        return steamId
      } else {
        throw new Error(
          `${username}: ${(vanityResult as TVanityResponseKo).response.message}`,
        )
      }
    },

    async getLibrary(steamId: string) {
      const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true`
      const response = await fetch(url)
      const text = await response.text()
      if (!response.ok) {
        throw new Error(text)
      }
      const result = GamesResponse.parse(JSON.parse(text))

      return result.response.games.map((game) => ({
        title: game.name,
        id: game.appid,
        heroCapsuleImageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/hero_capsule.jpg`,
        capsule616ImageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_616x353.jpg`,
        headerImageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
        capsule231ImageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_231x87.jpg`,
      }))
    },
  }
}
