import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from "@assets/background.png";
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import {useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
    name: string,
    email: string,
    password: string,
    password_confirm: string
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 digítos'),
    password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas não conferem'),
});

export function SignUp(){
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const toast = useToast();
    const { signIn } = useAuth();

    function handleGoSignIn(){
        navigation.goBack();
    }
    async function handleSignUp({name, email, password, password_confirm}: FormDataProps){
        try {
            setIsLoading(true);
            await api.post('/users', { name, email, password});
            await signIn(email, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde!';
            setIsLoading(false);
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    return(
        <VStack 
            flex={1} 
            bg="gray.700"
            p={10}
        >
            <Image
                source={BackgroundImg}
                defaultSource={BackgroundImg}
                alt="Pessoas treinando"
                resizeMode='contain'
                position="absolute"
            />
            <Center mt={24}>
                <LogoSvg/>
                <Text color="gray.100" fontSize="sm"> 
                    Treine sua mente e o seu corpo
                </Text>
            </Center>
            <Center flex={1}>
                <Heading color="gray.100" fontFamily="heading" fontSize="xl" mb={6}>
                    Crie sua conta
                </Heading>

                <Controller
                    control={control}
                    name='name'
                    render={({field: {onChange, value}}) =>
                        <Input 
                            placeholder='Nome'
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.name?.message}
                        />
                    }
                />
                <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) =>
                        <Input 
                            placeholder='E-mail'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.email?.message}
                            autoCorrect={false}
                        />
                    }
                />
                <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) =>
                        <Input 
                            placeholder='Senha'
                            secureTextEntry
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.password?.message}
                            autoCorrect={false}
                        />
                    }
                />
                <Controller
                    control={control}
                    name="password_confirm"
                    render={({field: {onChange, value}}) =>
                        <Input 
                            placeholder='Confirme a Senha'
                            secureTextEntry
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.password_confirm?.message}
                            onSubmitEditing={handleSubmit(handleSignUp)}
                            returnKeyType='send'
                        />
                    }
                />
                
                <Button
                    title="Criar e acessar"
                    onPress={handleSubmit(handleSignUp)}
                    isLoading={isLoading}
                />
            </Center>
            <Center mb={8}>
                <Button
                    title="Voltar para o login"
                    variant="outline"
                    onPress={handleGoSignIn}
                />
            </Center>
        </VStack>
    );
}