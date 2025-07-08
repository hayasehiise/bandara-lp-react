import { Spinner, VStack, Text } from "@chakra-ui/react";

export default function SpinnerLoading() {
  return (
    <VStack
      colorPalette="teal"
      justify={"center"}
      alignItems={"center"}
      height={"dvh"}
    >
      <Spinner color="colorPalette.600" size={"xl"} />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
}
