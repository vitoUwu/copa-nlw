import { useState } from "react";
import { Heading, Text, Toast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";

import Logo from '../assets/logo.svg'

export function CreatePoll() {
  const [pollName, setPollName] = useState<string>('')
  const [isCreatingPoll, setCreatingPoll] = useState<boolean>(false)

  async function handlePollCreate() {
    if (!pollName.trim()) {
      Toast.show({
        title: 'Informe um nome para o seu bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
      return
    }

    setCreatingPoll(true)
    try {
      await api.post('/polls', { title: pollName })
        .then((res) => {
          Toast.show({
            title: 'Bolão criado com sucesso',
            placement: 'top',
            bgColor: 'yellow.500'
          })
        })
    } catch(err) {
      console.log(err)
      Toast.show({
        title: 'Ocorreu um erro ao criar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setCreatingPoll(false)
      setPollName('')
    }
  }
  
  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Criar novo bolão'/>

      <VStack marginTop={8} marginX={5} alignItems='center'>
        <Logo/>
        <Heading fontFamily={'heading'} color='white' fontSize='xl' marginY={8} textAlign='center'>
          Crie seu próprio bolão da copa e compartilhe entre os amigos!
        </Heading>

        <Input
          value={pollName}
          onChangeText={setPollName}
          marginBottom={2}
          placeholder='Qual o nome do seu bolão?'
        />

        <Button title='Criar meu bolão' onPress={handlePollCreate} isLoading={isCreatingPoll}/>

        <Text color='gray.200' fontSize={'sm'} textAlign='center' paddingX={10} marginTop={4}>
          Após criar o seu bolão, você receberá um código único que poderá
          ser usado para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}