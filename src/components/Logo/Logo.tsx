"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoImage from "@/assets/logo/1.png";

const Logo = () => {
  return (
    <Link href={"/"} className="flex shrink">
      <Image src={LogoImage} alt="Logo for debate ai" className="w-32 md:w-36 lg:w-40 xl:w-48" priority />
    </Link>
  );
};

export default Logo;
