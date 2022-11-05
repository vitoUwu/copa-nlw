import { Heading, Toast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function SearchPoll() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  
  const navigation = useNavigation()
  
  async function handleJoinPoll() {
    if (!code.trim()) return Toast.show({
      title: 'Informe o código do bolão',
      placement: 'top',
      bgColor: 'red.500'
    })
    setLoading(true)
    try {
      const response = await api.post('/polls/join', { code })
      console.log(response)
      Toast.show({
        title: `Você entrou no bolão: ${response.data.title}`,
        placement: 'top',
        bgColor: 'green.500'
      })
      setLoading(false)
      navigation.navigate('polls')
    } catch(err) {
      setLoading(false)
      if (err.response?.data?.message === 'Poll not found') {
        Toast.show({
          title: 'O bolão não foi encontrado',
          placement: 'top',
          bgColor: 'red.500'
        })
        return
      }

      if (err.response?.data?.message === 'You already joined this poll.') {
        Toast.show({
          title: 'Você já está participando desse bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
        return
      }
      
      console.log(err)
      Toast.show({
        title: 'Ocorreu um erro ao buscar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Buscar por Código' showBackButton/>

      <VStack marginTop={8} marginX={5} alignItems='center'>
        <Heading fontFamily={'heading'} color='white' fontSize='xl' marginBottom={8} textAlign='center'>
          Encontre um bolão através de um código único.
        </Heading>

        <Input
          value={code}
          onChangeText={setCode}
          marginBottom={2}
          placeholder='Código do bolão'
        />

        <Button title='Buscar' onPress={handleJoinPoll} isLoading={isLoading}/>
      </VStack>
    </VStack>
  )
}