import { HistoryDTO } from "@dtos/HistoryDTO";
import { HStack, VStack, Text, Heading } from "native-base";

type Props = {
    data: HistoryDTO
}

export function HistoryCard({data}: Props){
    return(
        <HStack 
            w="full" 
            bg="gray.600" 
            py={4} 
            px={5} 
            rounded={"md"} 
            alignItems={"center"} 
            justifyContent={"space-between"}
            mb={3}
        >
            <VStack
                flex={1}
            >
                <Heading 
                    color="white" 
                    fontSize={"md"}  
                    fontFamily={"heading"} 
                    textTransform={"capitalize"}
                >
                    {data.group}
                </Heading>
                <Text 
                    color="gray.100" 
                    fontSize={"lg"}  
                    fontFamily={"body"}
                    numberOfLines={1}
                >
                    {data.name}
                </Text>
            </VStack>
            <Text color="gray.300" fontSize={"md"}  fontFamily={"body"}>
                {data.hour}
            </Text>
        </HStack>
    );
}