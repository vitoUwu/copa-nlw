import { FlatList, Toast, VStack, Icon } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from '@expo/vector-icons';
import { api } from "../services/api";
import { useCallback, useState } from "react";
import { PollCard, PollProps } from "../components/PollCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Polls() {

  const [isLoading, setLoading] = useState<boolean>(true)
  const [polls, setPolls] = useState<PollProps[]>([])

  const navigation = useNavigation()

  async function fetchPolls() {
    try {
      setLoading(true)
      const response = await api.get('/polls')
      setPolls(response.data.polls)
    } catch(err) {
      console.log(err)
      Toast.show({
        title: 'Ocorreu um erro ao exibir os seus bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    try {
      fetchPolls()
    } catch(err) {
      console.log(err)
    }
  }, []))

  return (
    <VStack flex={1} backgroundColor='gray.900'>
      <Header title="Meus Bolões"/>
      <VStack marginTop={6} marginX={5} borderBottomWidth={1} borderBottomColor='gray.600' paddingBottom={4} marginBottom={4}>
        <Button
          title='Buscar bolão por código'
          leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
          onPress={() => navigation.navigate('searchPoll')}
        />
      </VStack>

      { isLoading ? <Loading/> :
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PollCard data={item} onPress={() => navigation.navigate('pollDetails', { id: item.id })} />}
          paddingX={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={() => <EmptyPoolList/>}
        />
      }
    </VStack>
  )
}