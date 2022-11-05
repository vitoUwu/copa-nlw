import { Box, FlatList, Toast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState<string>('')
  const [secondTeamPoints, setSecondTeamPoints] = useState<string>('')

  async function handleGuessConfirmation(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        Toast.show({
          title: 'Informe o palpite corretamente',
          placement: 'top',
          bgColor: 'red.500'
        })
        return
      }
      await api.post(`/guesses/${poolId}/games/${gameId}`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })
      Toast.show({
        title: 'Palpite enviado',
        placement: 'top',
        bgColor: 'green.500'
      })
      fetchGames()
      // setDetails(response.data.poll)
    } catch(err) {
      console.log(err.response?.data)
      if (err.response?.data?.message === 'you cannot send guesses after the game has been ended') {
        return Toast.show({
          title: 'Você não pode fazer um palpite em um jogo que já ocorreu',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      Toast.show({
        title: 'Ocorreu um erro ao enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchGames() {
    try {
      setLoading(true)
      const response = await api.get(`/polls/${poolId}/games`)
      setGames(response.data.games)
    } catch(err) {
      console.log(err)
      Toast.show({
        title: 'Não foi possivel carregar os palpites',
        placement: 'top',
        color: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <Box>
      <FlatList
        data={games}
        keyExtractor={(game) => game.id}
        renderItem={({ item }) => {
          return <Game
            data={item}
            onGuessConfirm={() => handleGuessConfirmation(item.id)}
            setFirstTeamPoints={setFirstTeamPoints}
            setSecondTeamPoints={setSecondTeamPoints}
          />
        }}
      />
    </Box>
  );
}