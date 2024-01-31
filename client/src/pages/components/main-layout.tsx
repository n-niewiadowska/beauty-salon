import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { ComponentProps } from "@/app/types/propsTypes";


export const MainLayoutContainer = ({ children }: ComponentProps) => {
  
  return (
    <>
      <Head>
        <title>Beauty Salon</title>
      </Head>
      <div className="main-menu">
        <Link href="/"><Image src="/images/logo.png" width={80} height={60} alt="Logo"/></Link>
        <div>
          <Link href="/recommendations" className="normal-link">recommendations</Link>
          <Link href="/opinions" className="normal-link">opinions</Link>
          <Link href="/services" className="normal-link">services</Link>
          <Link href="/log-in" className="login-link">log in</Link>
          <Link href="/sign-up" className="signup-link">sign up</Link>
        </div>
      </div>
      <main>{children}</main>
    </>
  );
}