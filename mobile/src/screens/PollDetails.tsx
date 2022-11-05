import { useFocusEffect, useRoute } from "@react-navigation/native";
import { HStack, Toast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PollProps } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { api } from "../services/api";

interface RouteParams {
  id: string
}

export function PollDetails() {
  const [selectedOption, setSelectedOption] = useState<0 | 1>(0)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [details, setDetails] = useState<PollProps>({} as PollProps)

  const route = useRoute()
  const { id } = route.params as RouteParams

  async function handleCodeShare() {
    Share.share({
      message: `Entre no meu bolão! [${details.code}]`
    })
  }

  async function fetchPoll() {
    setLoading(true)
    try {
      const response = await api.get(`/polls/${id}`)
      setDetails(response.data.poll)
    } catch(err) {
      console.log(err)
      Toast.show({
        title: 'Ocorreu um erro ao carregar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPoll()
  }, [id]))

  if (isLoading) return (
    <Loading/>
  )

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header showBackButton showShareButton onShare={handleCodeShare} title={details.title}/>

      {
        details._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PollHeader data={details}/>
          <HStack bgColor='gray.800' padding={1} rounded='sm' fontSize='xs'>
            <Option title='Seus palpites' isSelected={selectedOption === 0} onPress={() => setSelectedOption(0)}/>
            <Option title='Ranking do Grupo' isSelected={selectedOption === 1} onPress={() => setSelectedOption(1)}/>
          </HStack>
          {
            selectedOption === 0 ? <Guesses poolId={id}/> : <Guesses poolId={id}/>
          }
        </VStack> :
        <EmptyMyPoolList code={details.code}/>
      }
    </VStack>
  )
}