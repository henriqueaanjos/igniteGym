import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from 'expo-file-system';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

type FormData = {
    name: string,
    email?: string,
    last_password?: string ,
    password?: string | null,
    password_confirm?: string | null,
}

const profileSchema = yup.object({
    name: yup
        .string()
        .required('Informe um nome'),
    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 digítos')
        .nullable()
        .transform((value) => !!value ? value : null),
    password_confirm: yup
        .string()
        .oneOf([yup.ref('password')], 'As senhas não conferem')
        .nullable()
        .transform((value) => !!value ? value : null)
        .when('password', {
            is: (Field: any) => Field,
            then: (schema) => schema
            .nullable()
            .required('Informe a confirmação da senha.')
            .transform((value) => !!value ? value : null)
        })
});

const PHOTO_SIZE = 33;

export function Profile(){
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);

    const toast = useToast();
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(profileSchema),
        defaultValues:{
            name: user.name,
            email: user.email
        }
    });

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
                selectionLimit:1,

            });
    
            if(photoSelected.canceled){
                return;
            }if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if(photoInfo.exists && (photoInfo.size /1024 /1024) > 5){
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }
                
                const fileExtension = photoSelected.assets[0].uri.split('.').pop();

                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);

                toast.show({
                    title: "Foto Atualizada!", 
                    placement: 'top',
                    bgColor: 'green.500'
                });

            }
        } catch (error) {
            console.log(error);
        }finally{
            setPhotoIsLoading(false);
        }
        
    }

    async function handleUpdateProfile({name, last_password, password}: FormData){
        try {
            setIsUpdating(true);
            const userUpdated = user;
            userUpdated.name = name;

            await api.put('/users', {name, old_password: last_password, password})

            await updateUserProfile(userUpdated);
            
            toast.show({
                title: "Perfil Atualizado com sucesso!", 
                placement: 'top',
                bgColor: 'green.500'
            });
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível fazer Login. Tente novamente mais tarde!'

            
            toast.show({
                title, 
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setIsUpdating(false);
        }
    }

    return(
        <VStack flex={1}>
            <ScreenHeader title="Perfil"/>
            <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
                <Center mt={6} px={10}>
                    {photoIsLoading ?
                        <Skeleton 
                            w={PHOTO_SIZE} 
                            h={PHOTO_SIZE} 
                            rounded="full"
                            startColor="gray.500"
                            endColor="gray.400"
                        />
                        :<UserPhoto
                            source={ user.avatar ? { 
                                uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
                                : defaultUserPhotoImg}
                            alt="Foto do usuário"
                            size={PHOTO_SIZE}
                        />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text
                            color={"green.500"}
                            fontFamily={"heading"}
                            fontSize={"md"}
                            mt={2}
                            mb={8}
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>
                    <Controller
                        name='name'
                        control={control}
                        render={({field: {onChange, value}}) => 
                            <Input
                                placeholder="Nome"
                                bg="gray.600"
                                onChangeText={onChange}
                                value={value}
                                errorMesage={errors.name?.message}
                            />
                        }
                    />
                    <Controller
                        name='email'
                        control={control}
                        render={({field: {onChange, value}}) => 
                            <Input
                                placeholder="email"
                                bg="gray.600"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                                errorMesage={errors.email?.message}
                            />
                        }
                    />
                
                    <Heading
                        color="gray.200"
                        fontSize="md"
                        mb={2}
                        alignSelf="flex-start"
                        fontFamily={"heading"}
                        mt={12}
                    >
                        Alterar senha
                    </Heading>

                    <Controller
                        name='last_password'
                        control={control}
                        render={({field: {onChange, value}}) => 
                            <Input
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                            />
                        }
                    />
                    <Controller
                        name='password'
                        control={control}
                        render={({field: {onChange, value}}) => 
                            <Input
                                bg="gray.600"
                                placeholder="Nova Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={!!value ? value : ''}
                                errorMesage={errors.password?.message}
                            />
                        }
                    />
                    <Controller
                        name='password_confirm'
                        control={control}
                        render={({field: {onChange, value}}) => 
                            <Input
                                bg="gray.600"
                                placeholder="Confirme nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={!!value ? value : ''}
                                errorMesage={errors.password_confirm?.message}
                            />
                        }
                    />
                    <Button
                        title="Atulizar"
                        mt={4}
                        onPress={handleSubmit(handleUpdateProfile)}
                        isLoading={isUpdating}
                    />
                </Center>
            </ScrollView>
        </VStack>
    );
}