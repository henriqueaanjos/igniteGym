import { Input as NativeBaseInput, IInputProps, FormControl} from 'native-base';

type Props = IInputProps &{
    errorMesage?: string | null
}

export function Input({errorMesage = null, isInvalid, ...rest}: Props){
    const invalid = !!errorMesage || isInvalid;
    return(
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput
                bg="gray.700"
                h={14}
                p={4}
                borderWidth={0}
                fontSize="md"
                color="white"
                fontFamily="body"
                isInvalid={invalid}
                _invalid={{
                    borderWidth:1, 
                    borderColor: "red.500"
                }}
                placeholderTextColor="gray.300"
                _focus={{
                    bg: "gray.700",
                    borderWidth: 1,
                    borderColor: "green.500"
                }}
                {...rest}
            />
            <FormControl.ErrorMessage
                _text={{ color: "red.500" }}
            >
                {errorMesage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}