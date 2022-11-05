
import Image from 'next/image';
import AppPreviewImage from '../assets/app-nlw-copa-preview.png'
import LogoImage from '../assets/logo.svg'
import UsersAvatarImage from '../assets/users-avatar-example.png'
import IconCheckImage from '../assets/icon-check.svg'
import { api } from '../lib/axios';
import { FormEvent, useRef } from 'react';

interface HomeProps {
  pollCount: number
  guessesCount: number
  usersCount: number
}

export default function Home({ pollCount, guessesCount, usersCount }: HomeProps) {
  const pollTitleInputRef = useRef<HTMLInputElement | null>(null)
  
  async function createPoll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const response = await api.post('/polls', {
        title: pollTitleInputRef.current!.value
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code)
      alert("Bolão criado com sucesso. O código foi copiado para a área de transferência")
      pollTitleInputRef.current!.value = ''
    } catch(err) {
      alert("Falha ao criar o bolão, tente novamente");
      console.log(err);
    }
  }

  return (
    <div className='max-w-[1124px] mx-auto grid grid-cols-2 gap-28 items-center min-h-screen my-10'>
      <main>
        <Image src={LogoImage} alt='Logo da aplicação' />
        <h1 className='mt-14 text-white font-bold text-5xl leading-tight'>
          Cria seu próprio bolão da copa e compartilhe entre amigos
        </h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={UsersAvatarImage} alt='Avatares de usuários, um ao lado do outro'/>
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>{ usersCount }</span> pessoas já estão usando
          </strong>
        </div>
        <form onSubmit={createPoll} className='mt-10 flex gap-2'>
          <input
            className='text-gray-100 outline-none focus:ring-2 ring-ignite-500 flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm'
            type='text'
            required
            name='pollTitle'
            ref={pollTitleInputRef}
            placeholder='Qual o nome do seu bolão?' />
          <button
            className='outline-none focus:ring-2 ring-ignite-500 bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-600 transition-colors'
            type='submit'
          >Criar meu bolão</button>
        </form>
        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu botão você receberá um códido único que
          poderá ser usado para convidar outras pessoas. 🚀
        </p>
        <div className='mt-10 pt-10 border-t border-gray-600 divide-gray-600 divide-x grid grid-cols-2 text-gray-100'>
          <div className='flex justify-start items-center gap-6'>
            <Image src={IconCheckImage} alt=''/>
            <div className='flex flex-col'>
              <span className='text-ignite-500 text-2xl font-bold'>{ pollCount }</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='flex justify-end items-center gap-6'>
            <Image src={IconCheckImage} alt=''/>
            <div className='flex flex-col'>
              <span className='text-ignite-500 text-2xl font-bold'>{ guessesCount }</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={AppPreviewImage}
        alt='Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa'
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [pollResponse, guessesResponse, usersResponse] = await Promise.all([
    api.get('polls/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      pollCount: pollResponse.data.count,
      guessesCount: guessesResponse.data.count,
      usersCount: usersResponse.data.count,
    }
  };
}