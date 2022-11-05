import { Center, Icon, Text } from 'native-base'
import { Button } from '../components/Button'
import { Fontisto } from '@expo/vector-icons'
import { useAuth } from '../hooks/useAuth'

import Logo from '../assets/logo.svg'

export function SignIn() {
  const { signIn, isUserLoading } = useAuth()

  return (
    <Center flex={1} bgColor='gray.900' padding={7}>
      <Logo width={212} height={40}/>
      <Button
        type='GOOGLE_LOGIN'
        title='Entrar com Google'
        leftIcon={<Icon as={Fontisto} name='google' color='white' size='md'/>}
        marginTop={12}
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{ _spinner: { color: 'white' } }}
      />
      <Text color='white' textAlign='center' marginTop={4}>
        Não utilizamos nenhuma informação além do seu e-mail para a criação da sua conta.
      </Text>
    </Center>
  )
}