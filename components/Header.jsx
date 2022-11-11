import React, { useState } from "react";
import Image from "next/image";
import ethLogo from "../assets/eth.png";
import uniLogo from "../assets/uniswap.png";
import { FiArrowUpRight, FiMoreVertical } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";

const Header = () => {
  const [selectedNav, setSelectedNav] = useState("Swap");
  console.log(selectedNav);

  const connectWallet = () => {
    console.log("Connect");
  };

  return (
    <div className="flex items-center justify-between w-screen p-4">
      {/* logo */}
      <div className="flex items-center justify-start w-1/4 bg-white">
        <Image src={uniLogo} alt="Uniswap logo" height={40} width={40} />
      </div>

      {/* nav bar */}
      <div className="flex flex-1">
        <div className="flex items-center justify-center rounded-3xl border-[0.1rem] border-[#33353b] bg-[#191b1f]">
          {["Swap", "Pool", "Vote"].map((navItem) => (
            <div
              onClick={() => setSelectedNav(navItem)}
              className={`m-1 cursor-pointer items-center rounded-3xl px-4 py-2 text-lg font-semibold ${
                selectedNav === navItem && "bg-[#3d444e]"
              }`}
              key={navItem}
            >
              {navItem}
            </div>
          ))}
          <a
            href="https://info.uniswap.org/#/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="`m-1 flex cursor-pointer items-center rounded-3xl px-4 py-2 text-lg font-semibold">
              Charts
              <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>

      {/* info */}
      <div className="flex items-center justify-end w-1/4">
        <div className="mx-2 flex cursor-pointer items-center rounded-2xl bg-[#191b1f] p-2 text-[0.9rem] font-semibold">
          <div className="flex items-center justify-center w-8 h-8">
            <Image src={ethLogo} alt="ETH logo" height={20} />
          </div>
          <p>Ethereum</p>
          <div className="flex items-center justify-center w-8 h-8">
            <AiOutlineDown />
          </div>
        </div>

        <div
          className="mx-2 flex cursor-pointer items-center rounded-2xl bg-[#191b1f] p-2 text-[0.9rem] font-semibold"
          onClick={connectWallet}
        >
          <div className="flex h-full items-center justify-center rounded-2xl border border-[#163256] bg-[#172a42] p-2 text-[#4f90ea] hover:border-[#234169]">
            Connect Wallet
          </div>
        </div>

        <div className="mx-2 flex cursor-pointer items-center rounded-2xl bg-[#191b1f] p-2 text-[0.9rem] font-semibold">
          <div className="flex items-center justify-center w-8 h-8 mx-2">
            <FiMoreVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
