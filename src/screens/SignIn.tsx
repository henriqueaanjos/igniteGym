import { VStack, Image, Text, Center, Heading, useToast} from 'native-base'

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRouteProps } from '@routes/auth.routes';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from "@assets/background.png";

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useState } from 'react';


type FormData = {
    email: string,
    password: string
}

const signInSchema = yup.object({
    email: yup.string().required('Informe o e-mail'),
    password: yup.string().required('Informe a Senha')
});

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<AuthNavigatorRouteProps>();

    const { control, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: yupResolver(signInSchema)
    });

    const { signIn } = useAuth();
    const toast = useToast();

    function handleGoSignUp(){
        navigation.navigate('signUp');
    }

    

    async function handleSignIn({email, password}: FormData){
        try {
            setIsLoading(true);
            await signIn(email, password);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível fazer Login. Tente novamente mais tarde!'

            setIsLoading(false);
            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            });
        }
    }

    return(
        <VStack 
            flex={1} 
            bg="gray.700"
            p={10}
            backgroundColor={'gray.600'}
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
                    Acesse sua conta
                </Heading>
                <Controller
                    name='email'
                    control={control}
                    render={({field: {onChange, value}}) => 
                        <Input 
                            placeholder='E-mail'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.email?.message}
                        />
                    }
                />
                <Controller
                    name='password'
                    control={control}
                    render={({field: {onChange, value}}) => 
                        <Input 
                            placeholder='Senha'
                            secureTextEntry
                            onChangeText={onChange}
                            value={value}
                            errorMesage={errors.password?.message}
                        />
                    }
                />
                <Button
                    onPress={handleSubmit(handleSignIn)}
                    title="Acessar"
                    isLoading={isLoading}
                />
            </Center>
            <Center mb={8}>
                <Text
                    color="gray.100"
                    fontSize="md"
                    fontFamily="body"
                    mb={3}
                >
                    Ainda não tem acesso?
                </Text>
                <Button
                    title="Criar conta"
                    variant="outline"
                    onPress={handleGoSignUp}
                />
            </Center>
        </VStack>
    );
}