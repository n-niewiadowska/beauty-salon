import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "@/app/utils/axios";
import { ComponentProps } from "@/app/types/propsTypes";
import { ButtonDropdown } from "@geist-ui/react";


export const AdminLayoutContainer = ({ children }: ComponentProps) => {
  const router = useRouter();

  const logOut = () => {
    axios.post("/users/logout")
      .then(() => {
        localStorage.removeItem("user");
        router.push("/");
      });
  }

  return (
    <>
      <Head>
        <title>Beauty Salon - Admin Profile</title>
      </Head>
      <div className="main-menu">
        <Link href="/admin"><Image src="/images/logo.png" width={80} height={60} alt="Logo"/></Link>
        <div>
          <Link href="/admin/appointments" className="normal-link">appointments</Link>
          <Link href="/admin/services" className="normal-link">services</Link>
          <ButtonDropdown>
            <ButtonDropdown.Item main>admin</ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={() => router.push("/admin/logs")}>show logs</ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={logOut}>log out</ButtonDropdown.Item>
          </ButtonDropdown>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
}