import {
  Button,
  Flex,
  Image,
  Link,
  Menu,
  Portal,
  CloseButton,
  Drawer,
} from "@chakra-ui/react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Navbar() {
  return (
    <Flex
      direction={"row"}
      padding={"2"}
      justify={"space-between"}
      backgroundColor={"blue.500"}
    >
      <Flex width={{ lg: "20%", md: "30%", base: "60%" }}>
        <Link asChild href="/">
          <Image src={"image/brand.png"} marginY={"auto"} alt="Brand Website" />
        </Link>
      </Flex>
      {/* bagian menu */}
      <Flex display={{ lg: "none", base: "flex" }}>
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <Button variant="ghost" size="sm">
              <GiHamburgerMenu color="white" />
            </Button>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Drawer Title</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
      <Flex direction={"row"} gap={"3"} display={{ lg: "flex", base: "none" }}>
        <Button variant={"ghost"} border={"none"} asChild>
          <Link
            textDecoration={"none"}
            color={"white"}
            _hover={{ color: "black" }}
            href="/berita"
          >
            Berita
          </Link>
        </Button>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant={"ghost"}
              border={"none"}
              color={"white"}
              _hover={{ color: "black" }}
              _open={{ color: "black" }}
            >
              Portal Informasi <FaAngleDoubleDown />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="informasi-umum-bandara"
                  cursor={"pointer"}
                  asChild
                >
                  <Link>Informasi Umum Bandara</Link>
                </Menu.Item>
                <Menu.Item value="sejarah" asChild cursor={"pointer"}>
                  <Link>Sejarah</Link>
                </Menu.Item>
                <Menu.Item value="tugas-dan-fungsi" asChild cursor={"pointer"}>
                  <Link>Tugas & Fungsi</Link>
                </Menu.Item>
                <Menu.Item
                  value="struktur-organisasi"
                  asChild
                  cursor={"pointer"}
                >
                  <Link>Struktur Organisasi</Link>
                </Menu.Item>
                <Menu.Item value="visi-dan-misi" asChild cursor={"pointer"}>
                  <Link>Visi & Misi</Link>
                </Menu.Item>
                <Menu.Item
                  value="maklumat-pelayanan"
                  asChild
                  cursor={"pointer"}
                >
                  <Link>Maklumat Pelayanan</Link>
                </Menu.Item>
                <Menu.Item
                  value="tarif-badan-layanan-umum"
                  asChild
                  cursor={"pointer"}
                >
                  <Link>Tarif Badan Layanan Umum</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant={"ghost"}
              border={"none"}
              color={"white"}
              _hover={{ color: "black" }}
              _open={{ color: "black" }}
            >
              Portal Sistem <FaAngleDoubleDown />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="simadu" asChild cursor={"pointer"}>
                  <Link>Sistem Manajemen Pengaduan</Link>
                </Menu.Item>
                <Menu.Item value="permohonan-pas" asChild cursor={"pointer"}>
                  <Link>Permohonan PAS Bandara</Link>
                </Menu.Item>
                <Menu.Item value="informasi-ppid" asChild cursor={"pointer"}>
                  <Link>Permohonan Informasi PPID</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant={"ghost"}
              border={"none"}
              color={"white"}
              _hover={{ color: "black" }}
              _open={{ color: "black" }}
            >
              Portal Support <FaAngleDoubleDown />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="help" asChild cursor={"pointer"}>
                  <Link>Help & Support</Link>
                </Menu.Item>
                <Menu.Item value="kontak" asChild cursor={"pointer"}>
                  <Link>Kontak</Link>
                </Menu.Item>
                <Menu.Item value="gratifikasi" asChild cursor={"pointer"}>
                  <Link>Pengaduan Gratifikasi</Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      {/* end menu */}
    </Flex>
  );
}
