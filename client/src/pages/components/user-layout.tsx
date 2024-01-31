import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "@/app/utils/axios";
import { useUsers } from "@/app/store/contexts";
import { ComponentProps } from "@/app/types/propsTypes";
import { ButtonDropdown } from "@geist-ui/react";


export const UserLayoutContainer = ({ children }: ComponentProps) => {
  const router = useRouter();
  const { dispatch } = useUsers() || {};

  const logOut = () => {
    axios.post("/users/logout")
      .then(() => {
        localStorage.removeItem("user");
        router.push("/");
      });
  }

  const deleteAccount = () => {
    const confirmation = window.confirm("Are you sure you want to delete your account?");

    if (confirmation) {
      axios.delete("/users/user")
        .then(() => {
          if (dispatch) {
            dispatch({type: "LOGOUT"});
          }
          window.alert("Account deleted successfully!");
          router.push("/");
        });
    }
  }
  return (
    <>
      <Head>
        <title>Beauty Salon - User Profile</title>
      </Head>
      <div className="main-menu">
        <Link href="/user"><Image src="/images/logo.png" width={80} height={60} alt="Logo"/></Link>
        <div>
          <Link href="/user/appointments">my appointments</Link>
          <ButtonDropdown>
            <ButtonDropdown.Item main>my account</ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={logOut}>log out</ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={deleteAccount}>delete account</ButtonDropdown.Item>
          </ButtonDropdown>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
}