"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Flex, Button, Fieldset, Field, Input, Stack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      toaster.create({
        description: "Login Gagal",
        type: "error",
      });
    }
  }

  return (
    <>
      <Flex
        direction={"column"}
        width={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"dvh"}
      >
        <form onSubmit={handleSubmit}>
          <Fieldset.Root width={"xl"}>
            <Stack>
              <Fieldset.Legend>Login</Fieldset.Legend>
              <Fieldset.HelperText>Login Sebelum Masuk</Fieldset.HelperText>
            </Stack>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field.Root>
            </Fieldset.Content>
            <Button variant={"solid"} type="submit">
              Login
            </Button>
          </Fieldset.Root>
        </form>
        <Toaster />
      </Flex>
    </>
  );
}
