import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useCallback, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { createSteamApi } from '@/model/steam-api'
import { Skeleton, TextField } from '@mui/material'
import styles from './games.module.css'

// const VanityResponseOk = z.object({
//   response: z.object({ success: z.literal(1), steamid: z.string() }),
// })
// type TVanityResponseOk = z.infer<typeof VanityResponseOk>
// const VanityResponseKo = z.object({
//   response: z.object({ success: z.number(), message: z.string() }),
// })
// type TVanityResponseKo = z.infer<typeof VanityResponseKo>
// const VanityResponse = z.union([VanityResponseKo, VanityResponseOk])

const readGamesServerFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.VITE_STEAM_API_KEY
    if (apiKey === undefined) throw new Error('VITE_STEAM_API_KEY not set')
    const steamApi = createSteamApi(apiKey)
    const steamId = await steamApi.getSteamId(data.username)
    const games = await steamApi.getLibrary(steamId)
    return games
  })

export const Route = createFileRoute('/games')({
  component: RouteComponent,
})

function RouteComponent() {
  const [username, setUsername] = useState('')

  const debouncedUsername = useDebounce(username, 300)

  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value),
    [],
  )

  const readGames = useServerFn(readGamesServerFn)

  const readGamesQuery = useQuery({
    queryKey: ['read-games', debouncedUsername],
    queryFn: () => readGames({ data: { username: username } }),
    retry: 0,
  })

  if (readGamesQuery.status === 'error') {
    console.log(readGamesQuery.error)
  }

  return (
    <div>
      <div>
        <TextField
          label="Username"
          onChange={onChange}
          value={username}
        ></TextField>
      </div>
      {readGamesQuery.status === 'pending' && (
        <Skeleton variant="rectangular" />
      )}
      {readGamesQuery.status === 'success' && (
        <ul className={styles.list}>
          {readGamesQuery.data.map((game) => (
            <li
              key={game.id}
              style={{ backgroundImage: `url(${game.heroCapsuleImageUrl})` }}
            >
              {game.title}
            </li>
          ))}
        </ul>
      )}
      {readGamesQuery.status === 'error' && (
        <div>There's been an error: {readGamesQuery.error.message}</div>
      )}
    </div>
  )
}
