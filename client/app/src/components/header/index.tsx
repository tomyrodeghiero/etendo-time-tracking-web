import React from "react";
import {
  BOXES,
  ETENDO_WHITE_LOGOTYPE,
  STARS,
  WAVING_HAND,
} from "../../constants/assets";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const Header = ({ firstName }: any) => {
  return (
    <div>
      <div className="relative bg-blue-900 shadow-md">
        <div className="py-5 flex justify-between px-20 mx-auto items-center">
          <div className="flex items-center gap-12">

            <div className="flex items-center gap-5 rounded">
              <Image
                height={45}
                width={45}
                src={WAVING_HAND}
                alt="Waving hand"
              />
              <div className="flex gap-2">
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col text-white">
                    <h2 className="text-lg">Hola, {firstName}</h2>
                    <h3 className="font-semibold text-xl -mt-1">
                      ¡Bienvenido!
                    </h3>
                  </div>

                  <img className="h-10" src={STARS} alt="Stars" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <UserButton />
          </div>
        </div>
        <img src={BOXES} alt="Boxes" className="w-full" />
      </div>
    </div>
  );
};

export default Header;
